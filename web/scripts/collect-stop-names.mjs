#!/usr/bin/env node
/**
 * Round 26-C1E.1 — 공식 영문 정류장명 수집기 (로컬 전용, 하드닝 적용).
 *
 * 서울 열린데이터광장 OA-12830 (ListBusStationMultilangInfo) 에서
 * routes.json 이 실제로 사용하는 고유 stopId 만 조회해 SSOT 를 생성한다.
 *
 * 사용법:
 *   node scripts/collect-stop-names.mjs --allow-insecure-http            # 미리보기 (정본 미작성)
 *   node scripts/collect-stop-names.mjs --allow-insecure-http --write    # 검증 통과 후 정본 교체
 *   node scripts/collect-stop-names.mjs --check                          # 현재 정본 3파일 세대·의미 검사 (네트워크 없음)
 *   node scripts/collect-stop-names.mjs --allow-insecure-http --review-baseline-change
 *   node scripts/collect-stop-names.mjs --fixture <path> [--out-dir <path>] [--write]
 *
 * 보안 한계 (과장 없이):
 *   애플리케이션 로그에는 인증키와 전체 요청 URL을 출력하지 않는다.
 *   다만 서울 OpenAPI 는 HTTPS 를 제공하지 않으므로 공식 API 전송 자체가 평문 HTTP 라는 제한이 있다.
 *   프록시·게이트웨이 등 네트워크 경로의 접근 로그까지는 이 스크립트가 보장하지 못한다.
 *
 * 프로덕션 빌드는 이 스크립트를 호출하지 않는다. API 는 로컬 수집에서만 사용한다.
 */

import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync, rmSync, openSync, fsyncSync, closeSync, mkdtempSync } from 'node:fs';
import { dirname, join, basename, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import {
  BASELINE,
  buildArtifacts,
  buildMeta,
  readRouteStops,
  selectExactRow,
  stableStringify,
  summarize,
  toOfficialId,
  validateArtifacts,
} from './lib/stop-names-core.mjs';

const WEB_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ROUTES_PATH = join(WEB_ROOT, 'data/routes.json');
const DEFAULT_OUT_DIR = join(WEB_ROOT, 'data/stops');
const FILE_NAMES = {
  names: 'stop-names.json',
  meta: 'stop-names.meta.json',
  reviews: 'stop-name-reviews.json',
};

// 테스트 seam: 오프라인 시나리오에서만 로컬 스텁 서버를 가리키도록 덮어쓴다.
const API_BASE = process.env.STOP_NAMES_API_BASE ?? 'http://openapi.seoul.go.kr:8088';
const SERVICE = 'ListBusStationMultilangInfo';
const REQUEST_INTERVAL_MS = Number(process.env.STOP_NAMES_INTERVAL_MS ?? 150);
const REQUEST_TIMEOUT_MS = Number(process.env.STOP_NAMES_TIMEOUT_MS ?? 15000);
const MAX_ATTEMPTS = 3;
/** 하드 실패가 이 수를 넘으면 남은 요청을 계속하지 않고 즉시 중단한다. */
const MAX_HARD_FAILURES = 5;
/** 재시도 대상 API 결과 코드 (일시적 서버·DB 오류) */
const TRANSIENT_API_CODES = new Set(['ERROR-500', 'ERROR-600', 'ERROR-601']);

const argv = process.argv.slice(2);
const hasFlag = (name) => argv.includes(name);
const flagValue = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : null;
};

const OPTS = {
  write: hasFlag('--write'),
  check: hasFlag('--check'),
  reviewBaseline: hasFlag('--review-baseline-change'),
  allowInsecure: hasFlag('--allow-insecure-http'),
  fixture: flagValue('--fixture'),
  outDir: flagValue('--out-dir') ?? DEFAULT_OUT_DIR,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * 핵심 로직은 process.exit() 를 호출하지 않는다. CLI 진입점만 종료 코드를 정한다 (26-C1E.4 P2).
 * 이렇게 해야 테스트가 생산 함수를 그대로 호출하고 fetch 호출 수를 계측할 수 있다.
 */
class CollectorError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CollectorError';
  }
}

function fail(message) {
  throw new CollectorError(message);
}

/** 인증키 로드. 값·길이·일부 문자 어느 것도 출력하지 않는다. */
function loadApiKey() {
  if (process.env.SEOUL_OPENAPI_KEY) return process.env.SEOUL_OPENAPI_KEY.trim();
  const envPath = join(WEB_ROOT, '.env.local');
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^\s*SEOUL_OPENAPI_KEY\s*=\s*(.+?)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, '');
    }
  }
  return null;
}

// ── 응답 획득 ────────────────────────────────────────────────────

/**
 * 한 번의 HTTP 시도. 성공/일시오류/영구오류/no-row 를 구분해 반환한다.
 * deps 로 fetch 구현과 타임아웃을 주입할 수 있어 테스트가 이 생산 함수를 그대로 호출한다.
 */
export async function attemptFetch(key, officialId, deps = {}) {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const timeoutMs = deps.timeoutMs ?? REQUEST_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(`${API_BASE}/${key}/json/${SERVICE}/1/5/${officialId}/`, {
      signal: controller.signal,
    });
    if (res.status >= 500) return { kind: 'transient', reason: `http_5xx:${res.status}` };
    if (!res.ok) return { kind: 'permanent', reason: `http_error:${res.status}` };

    // 26-C1E.3 P2-②: 200 응답인데 JSON 이 깨졌다면 프로토콜·스키마 오류다. 재시도하지 않는다.
    let body;
    try {
      body = await res.json();
    } catch {
      return { kind: 'permanent', reason: 'invalid_response_json' };
    }
    if (body === null || typeof body !== 'object') {
      return { kind: 'permanent', reason: 'invalid_response_shape' };
    }
    const payload = body[SERVICE];
    const code = payload?.RESULT?.CODE ?? body?.RESULT?.CODE ?? 'UNKNOWN';

    if (code === 'INFO-100') return { kind: 'permanent', reason: 'authentication_failed' };
    if (code === 'INFO-200') return { kind: 'no_row', reason: 'INFO-200' };
    if (TRANSIENT_API_CODES.has(code)) return { kind: 'transient', reason: `api_transient:${code}` };
    if (code !== 'INFO-000') return { kind: 'permanent', reason: `api_error:${code}` };

    const selected = selectExactRow(payload?.row ?? [], officialId);
    if (selected.kind !== 'ok') return { kind: selected.kind, reason: selected.reason };
    return { kind: 'ok', response: selected.row, ignoredRows: selected.ignoredRows };
  } catch (error) {
    // 26-C1E.5 P1: fetch·프록시 오류 메시지에는 요청 URL(경로에 인증키 포함)이 섞일 수 있다.
    // 원문을 절대 전파하지 않고 고정된 안전 코드만 사용한다.
    const reason = error?.name === 'AbortError' ? 'network_timeout' : 'network_request_failed';
    return { kind: 'transient', reason };
  } finally {
    clearTimeout(timer);
  }
}

/** 재시도 정책 적용. INFO-200 도 최소 1회 재확인한 뒤에만 no-row 후보로 본다. */
export async function fetchStation(key, officialId, deps = {}) {
  const backoff = deps.backoff ?? ((attempt) => sleep(400 * attempt));
  let last = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const result = await attemptFetch(key, officialId, deps);
    last = result;
    if (result.kind === 'ok' || result.kind === 'permanent') return result;
    if (result.kind === 'no_row' && attempt >= 2) return result; // 최소 1회 재확인
    if (attempt < MAX_ATTEMPTS) await backoff(attempt);
  }
  return last;
}

/** fixture 모드: 네트워크 없이 동일 계약으로 응답을 공급한다. */
function fixtureResponses(uniqueStopIds) {
  const raw = JSON.parse(readFileSync(OPTS.fixture, 'utf8'));
  const responses = new Map();
  const hardFailures = [];
  let matched = 0;
  let unmatched = 0;
  for (const stopId of uniqueStopIds) {
    const entry = raw[toOfficialId(stopId)] ?? raw[stopId] ?? null;
    if (!entry || entry.kind === 'no_row') {
      responses.set(stopId, { ok: false });
      unmatched += 1;
    } else if (entry.kind === 'permanent' || entry.kind === 'transient') {
      hardFailures.push({ stopId, reason: entry.reason ?? entry.kind });
      responses.set(stopId, { ok: false });
    } else {
      const nameKo = (entry.nameKo ?? '').trim();
      const nameEn = (entry.nameEn ?? '').trim();
      if (!nameKo || !nameEn) {
        hardFailures.push({ stopId, reason: !nameKo ? 'empty_official_ko' : 'empty_official_en' });
        responses.set(stopId, { ok: false });
      } else {
        responses.set(stopId, { ok: true, nameKo, nameEn });
        matched += 1;
      }
    }
  }
  return { responses, matched, unmatched, hardFailures };
}

export async function collectFromApi(uniqueStopIds, deps = {}) {
  // 호출자가 key 를 명시하면(null 이어도) 환경 키로 폴백하지 않는다.
  // ?? 폴백은 "키 없음" 을 표현할 수 없어 의도치 않게 실제 키를 사용하게 된다.
  const key = Object.prototype.hasOwnProperty.call(deps, 'key') ? deps.key : loadApiKey();
  if (!key) {
    fail('SEOUL_OPENAPI_KEY 가 로컬 환경에 없습니다. web/.env.local 에 설정한 뒤 다시 실행하세요. (파일은 변경되지 않았습니다)');
  }
  if (!(deps.allowInsecure ?? OPTS.allowInsecure)) {
    fail(
      '서울 OpenAPI 는 인증키를 평문 HTTP 경로로 전송합니다. 전용·회전 가능한 키를 사용하고 위험을 명시적으로 수용한 경우에만 --allow-insecure-http 로 실행하세요. (요청 0건, 파일 변경 없음)',
    );
  }

  console.log(`공식 API 조회 시작 (${uniqueStopIds.length}건, 간격 ${REQUEST_INTERVAL_MS}ms, 타임아웃 ${REQUEST_TIMEOUT_MS}ms)`);
  const responses = new Map();
  const hardFailures = [];
  let matched = 0;
  let unmatched = 0;

  for (let i = 0; i < uniqueStopIds.length; i += 1) {
    const stopId = uniqueStopIds[i];
    const result = await fetchStation(key, toOfficialId(stopId), deps);
    if (result.kind === 'ok') {
      matched += 1;
      responses.set(stopId, result.response);
      if (result.ignoredRows > 0) {
        console.warn(`  경고: ${stopId} 응답에 요청 ID 와 다른 행 ${result.ignoredRows}건이 섞여 있어 무시했습니다.`);
      }
    } else if (result.kind === 'no_row') {
      unmatched += 1;
      responses.set(stopId, { ok: false });
    } else {
      hardFailures.push({ stopId, reason: result.reason });
      responses.set(stopId, { ok: false });
      if (hardFailures.length >= MAX_HARD_FAILURES) {
        console.error(`\n하드 실패가 ${hardFailures.length}건에 도달해 남은 요청을 중단합니다.`);
        break;
      }
    }
    if ((i + 1) % 60 === 0) console.log(`  ${i + 1}/${uniqueStopIds.length} …`);
    await sleep(deps.intervalMs ?? REQUEST_INTERVAL_MS);
  }
  return { responses, matched, unmatched, hardFailures };
}

// ── 안전한 다중 파일 교체 ────────────────────────────────────────

function writeFileSynced(path, contents) {
  writeFileSync(path, contents, 'utf8');
  const fd = openSync(path, 'r');
  try {
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
}

function fsyncDir(path) {
  try {
    const fd = openSync(path, 'r');
    try {
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
  } catch {
    /* 플랫폼에 따라 디렉터리 fsync 가 불가능할 수 있다. 최선 노력. */
  }
}

/**
 * staged write + rollback.
 * 세 파일의 완전한 원자적 교체는 파일시스템 수준에서 불가능하다.
 * 대신 기존 정본을 백업한 뒤 교체하고, 중간 실패 시 이전 세대로 되돌린다.
 * @param {(step: string) => void} [injectFailure] 테스트용 실패 주입 훅
 */
export function commitArtifacts(outDir, payload, injectFailure = () => {}) {
  mkdirSync(outDir, { recursive: true });
  const staging = mkdtempSync(join(outDir, '.staging-'));
  const backupDir = mkdtempSync(join(outDir, '.backup-'));
  const targets = [
    [FILE_NAMES.names, payload.names],
    [FILE_NAMES.meta, payload.meta],
    [FILE_NAMES.reviews, payload.reviews],
  ];
  // 파일별 상태를 개별 추적한다. 전체 boolean 하나로 세 파일을 대표하지 않는다 (P1-②).
  const state = new Map(
    targets.map(([name]) => [
      name,
      {
        existedBefore: existsSync(join(outDir, name)),
        backupCreated: false,
        replacementApplied: false,
        restoreAttempted: false,
        restoreSucceeded: false,
      },
    ]),
  );
  const recoveryErrors = [];
  const safely = (label, fn) => {
    try {
      fn();
      return true;
    } catch (e) {
      recoveryErrors.push(new Error(`${label}: ${e?.message ?? e}`));
      return false;
    }
  };

  try {
    // 1) 스테이징에 작성 후 되읽어 동일성 확인
    for (const [name, contents] of targets) {
      const p = join(staging, name);
      writeFileSynced(p, contents);
      if (readFileSync(p, 'utf8') !== contents) throw new Error(`스테이징 파일 검증 실패: ${name}`);
    }
    injectFailure('after_staging');

    // 2) 기존 정본 백업
    for (const [name] of targets) {
      const cur = join(outDir, name);
      if (state.get(name).existedBefore) {
        writeFileSynced(join(backupDir, name), readFileSync(cur, 'utf8'));
        state.get(name).backupCreated = true;
      }
    }
    injectFailure('after_backup');

    // 3) 순차 교체 (개별 rename 은 원자적, 세 파일 전체는 원자적이지 않다)
    let replacedCount = 0;
    for (const [name] of targets) {
      renameSync(join(staging, name), join(outDir, name));
      state.get(name).replacementApplied = true;
      replacedCount += 1;
      injectFailure(`after_replace_${replacedCount}`);
    }
    fsyncDir(outDir);

    // 4) 성공 후에만 백업·스테이징 제거
    safely('backup 정리', () => rmSync(backupDir, { recursive: true, force: true }));
    safely('staging 정리', () => rmSync(staging, { recursive: true, force: true }));
    if (recoveryErrors.length > 0) {
      return { ok: true, cleanupErrors: recoveryErrors, state, backupDir: existsSync(backupDir) ? backupDir : null };
    }
    return { ok: true, state, backupDir: null };
  } catch (error) {
    // 롤백: 각 파일을 개별 try/catch 로 복구한다. 하나가 실패해도 나머지를 계속 시도한다.
    for (const [name] of [...targets].reverse()) {
      const st = state.get(name);
      if (!st.replacementApplied) continue;
      st.restoreAttempted = true;
      if (st.backupCreated) {
        st.restoreSucceeded = safely(`복원(${name})`, () => {
          writeFileSynced(join(outDir, name), readFileSync(join(backupDir, name), 'utf8'));
        });
      } else {
        // 이전에 없던 파일이 새로 생성된 경우 → 제거해 혼합 세대를 남기지 않는다.
        st.restoreSucceeded = safely(`신규 파일 제거(${name})`, () => {
          rmSync(join(outDir, name), { force: true });
        });
      }
    }
    safely('디렉터리 fsync', () => fsyncDir(outDir));
    safely('staging 정리', () => rmSync(staging, { recursive: true, force: true }));

    // 복구가 하나라도 실패하면 백업을 절대 삭제하지 않는다 (26-C1E.4 P1).
    // 수동 복구 수단을 없애는 것이 원래 오류보다 더 위험하다.
    const restoreFailed = [...state.values()].some((s) => s.restoreAttempted && !s.restoreSucceeded);
    const recoveryClean = recoveryErrors.length === 0 && !restoreFailed;
    if (recoveryClean) {
      safely('backup 정리', () => rmSync(backupDir, { recursive: true, force: true }));
    }
    const backupPreserved = existsSync(backupDir) ? backupDir : null;

    const fileStates = Object.fromEntries([...state.entries()].map(([k, v]) => [k, { ...v }]));
    // 원래 오류를 복구 오류로 덮지 않는다. 둘 다 보존해 함께 보고한다.
    // 복구 오류가 없어도 recovery 정보를 담은 오류를 반환한다 (CLI 까지 경로를 전달하기 위함).
    const aggregate = new AggregateError(
      [error, ...recoveryErrors],
      recoveryErrors.length > 0 ? '정본 교체 실패 및 복구 중 추가 오류' : '정본 교체 실패',
    );
    // 수동 복구에 필요한 정보만 붙인다. 인증키·요청 URL 은 포함하지 않는다.
    aggregate.recovery = {
      backupDir: backupPreserved,
      artifactDir: outDir,
      fileStates,
      mixedGenerationPossible: restoreFailed,
    };

    return {
      ok: false,
      error,
      recoveryErrors,
      restoreFailed,
      state,
      backupDir: backupPreserved,
      mixedGenerationPossible: restoreFailed,
      aggregate,
    };
  }
}

// ── 모드별 동작 ─────────────────────────────────────────────────

/**
 * 현재 정본을 읽는다. 세 파일 중 일부만 존재하면 손상으로 판정한다 (26-C1E.3 §5).
 * @returns {{state:'none'|'partial'|'complete'|'unreadable', present?:string[], missing?:string[], ...}}
 */
export function readCurrentArtifacts(outDir) {
  const paths = {
    names: join(outDir, FILE_NAMES.names),
    meta: join(outDir, FILE_NAMES.meta),
    reviews: join(outDir, FILE_NAMES.reviews),
  };
  const present = Object.keys(paths).filter((k) => existsSync(paths[k]));
  const missing = Object.keys(paths).filter((k) => !existsSync(paths[k]));
  if (present.length === 0) return { state: 'none', missing };
  if (missing.length > 0) return { state: 'partial', present, missing };
  try {
    const rawNames = readFileSync(paths.names, 'utf8');
    const rawReviews = readFileSync(paths.reviews, 'utf8');
    return {
      state: 'complete',
      records: JSON.parse(rawNames),
      meta: JSON.parse(readFileSync(paths.meta, 'utf8')),
      reviews: JSON.parse(rawReviews),
      rawTexts: { names: rawNames, reviews: rawReviews },
    };
  } catch (error) {
    return { state: 'unreadable', error };
  }
}

/** --check: 네트워크 없이 현재 정본 3파일의 세대·의미 정합만 확인한다. */
function runCheck(routesData) {
  const current = readCurrentArtifacts(OPTS.outDir);
  if (current.state === 'none') fail('현재 정본이 없어 --check 를 수행할 수 없습니다.');
  if (current.state === 'partial') {
    fail(`정본이 부분적으로만 존재합니다 (있음: ${current.present.join(', ')} / 없음: ${current.missing.join(', ')}). 손상된 정본으로 판정합니다.`);
  }
  if (current.state === 'unreadable') fail('정본 JSON 을 파싱할 수 없습니다 (invalid_artifact_json).');
  const errors = validateArtifacts({
    routesData,
    records: current.records,
    reviews: current.reviews,
    meta: current.meta,
    rawTexts: current.rawTexts,
  });
  console.log('=== --check (네트워크 미사용) ===');
  console.log(`  generationId: ${current.meta.generationId}`);
  console.log(`  상태별: ${JSON.stringify(summarize(current.records))}`);
  console.log(`  collectedAt 은 의미 비교에서 제외합니다.`);
  if (errors.length > 0) {
    for (const e of errors) console.error(`  - ${e}`);
    fail(`세대·의미 검증 오류 ${errors.length}건`);
  }
  console.log('\n[PASS] 세 파일 내용·세대 일치, 수집 시각 외 의미 diff 0');
}

export async function runCollector() {
  const routesData = JSON.parse(readFileSync(ROUTES_PATH, 'utf8'));
  const { uniqueStopIds, koByStopId, rows } = readRouteStops(routesData);

  if (OPTS.check && !OPTS.fixture) {
    runCheck(routesData);
    return;
  }

  console.log(`정류장 레코드 ${rows.length}건 / 고유 stopId ${uniqueStopIds.length}건`);
  if (uniqueStopIds.length !== BASELINE.requestedStopIds) {
    fail(`고유 stopId 가 ${BASELINE.requestedStopIds}개가 아닙니다 (실제 ${uniqueStopIds.length}). 기준과 다르므로 중단합니다.`);
  }

  const collected = OPTS.fixture
    ? fixtureResponses(uniqueStopIds)
    : await collectFromApi(uniqueStopIds);

  if (collected.hardFailures.length > 0) {
    console.error('\n조회 실패 stopId (미매칭과 구분되는 오류):');
    for (const f of collected.hardFailures) console.error(`  ${f.stopId} — ${f.reason}`);
    fail(`API/스키마 오류 ${collected.hardFailures.length}건. 정본을 변경하지 않고 중단합니다.`);
  }

  // 기준 수치 보호 — 자동으로 새 기준을 받아들이지 않는다.
  const unmatchedIds = uniqueStopIds.filter((id) => !collected.responses.get(id)?.ok).sort();
  const baselineIds = [...BASELINE.unmatchedStopIds].sort();
  const baselineChanged =
    collected.matched !== BASELINE.apiMatched ||
    collected.unmatched !== BASELINE.apiUnmatched ||
    unmatchedIds.join(',') !== baselineIds.join(',');

  if (baselineChanged) {
    console.log('\n=== 기준 수치 변경 감지 ===');
    console.log(`  matched   : ${collected.matched} (기준 ${BASELINE.apiMatched})`);
    console.log(`  unmatched : ${collected.unmatched} (기준 ${BASELINE.apiUnmatched})`);
    const added = unmatchedIds.filter((id) => !baselineIds.includes(id));
    const removed = baselineIds.filter((id) => !unmatchedIds.includes(id));
    if (added.length) console.log(`  새로 미매칭이 된 ID: ${added.join(', ')}`);
    if (removed.length) console.log(`  이전 미매칭이었으나 이제 반환되는 ID: ${removed.join(', ')} (공식 데이터 갱신 가능성)`);
    if (!OPTS.reviewBaseline) {
      fail('기준과 다른 결과입니다. 정본을 쓰지 않았습니다. --review-baseline-change 로 차이를 검토한 뒤 별도 승인을 받으세요.');
    }
    console.log('\n--review-baseline-change: 읽기 전용입니다. 정본을 작성하지 않았습니다.');
    return;
  }
  if (OPTS.reviewBaseline) {
    console.log('\n--review-baseline-change: 기준과 동일합니다. 변경 없음.');
    return;
  }

  // 메모리에서 산출물 생성 → 쓰기 전 검증
  const { records, reviews, errors: buildErrors } = buildArtifacts({
    uniqueStopIds,
    koByStopId,
    responses: collected.responses,
  });
  if (buildErrors.length > 0) {
    for (const e of buildErrors) console.error(`  - ${e}`);
    fail(`산출물 생성 오류 ${buildErrors.length}건. 정본을 변경하지 않았습니다.`);
  }

  const collectedAt = new Date().toISOString();
  const meta = buildMeta({
    records,
    reviews,
    collectedAt,
    apiMatched: collected.matched,
    apiUnmatched: collected.unmatched,
    requestedStopIds: uniqueStopIds.length,
  });

  const validationErrors = validateArtifacts({ routesData, records, reviews, meta });
  if (validationErrors.length > 0) {
    console.error(`\n쓰기 전 검증 실패 ${validationErrors.length}건:`);
    for (const e of validationErrors) console.error(`  - ${e}`);
    fail('검증에 실패해 정본을 변경하지 않았습니다.');
  }

  console.log(`\n상태별 집계(stopId 기준): ${JSON.stringify(summarize(records))}`);
  console.log(`API matched ${collected.matched} / unmatched ${collected.unmatched} / generationId ${meta.generationId}`);
  console.log('쓰기 전 검증: PASS');

  if (!OPTS.write) {
    console.log('\n미리보기 모드입니다. 정본을 작성하지 않았습니다. (--write 로 작성)');
    return;
  }

  // 기존 정본 상태 확인 — 부분 존재는 손상으로 판정하고 쓰기 전에 차단한다 (§5).
  const current = readCurrentArtifacts(OPTS.outDir);
  if (current.state === 'partial') {
    fail(
      `정본이 부분적으로만 존재합니다 (있음: ${current.present.join(', ')} / 없음: ${current.missing.join(', ')}). 손상된 정본이므로 쓰기를 차단합니다. 기존 파일은 변경하지 않았습니다.`,
    );
  }
  if (current.state === 'unreadable') {
    fail('기존 정본 JSON 을 파싱할 수 없습니다 (invalid_artifact_json). 쓰기를 차단합니다.');
  }

  // no-op 판정 전에 기존 정본 자체를 반드시 검증한다 (P1-③). 자동 치유하지 않는다.
  if (current.state === 'complete') {
    const existingErrors = validateArtifacts({
      routesData,
      records: current.records,
      reviews: current.reviews,
      meta: current.meta,
      rawTexts: current.rawTexts,
    });
    if (existingErrors.length > 0) {
      console.error(`\n기존 정본 검증 실패 ${existingErrors.length}건:`);
      for (const e of existingErrors) console.error(`  - ${e}`);
      fail('기존 정본이 손상되었습니다. 자동 치유하지 않고 쓰기를 차단합니다. (기존 파일 변경 없음)');
    }
    const same =
      stableStringify(current.records) === stableStringify(records) &&
      stableStringify(current.reviews) === stableStringify(reviews) &&
      current.meta?.generationId === meta.generationId;
    if (same) {
      console.log('\nmeaningful change 0 — 기존 세 파일을 유지했습니다. (수집 시각만 달라짐)');
      return;
    }
  }

  const payload = {
    names: stableStringify(records),
    meta: stableStringify(meta),
    reviews: stableStringify(reviews),
  };
  const failStep = process.env.STOP_NAMES_INJECT_FAILURE ?? null;
  const result = commitArtifacts(OPTS.outDir, payload, (step) => {
    if (failStep && step === failStep) throw new Error(`주입된 실패: ${step}`);
  });
  if (!result.ok) {
    // 원래 오류 객체(recovery 정보 포함)를 그대로 던진다.
    // fail() 로 문자열화하면 백업 경로·파일별 복원 상태가 CLI 까지 전달되지 않는다 (26-C1E.5 P1).
    throw result.aggregate ?? result.error;
  }
  for (const e of result.cleanupErrors ?? []) console.warn(`  경고: 정리 중 오류 — ${e.message}`);
  console.log(`\n정본 교체 완료: ${records.length}건 / 검토 로그 ${reviews.length}건 (${basename(OPTS.outDir)})`);
}

/**
 * CLI 오류 formatter (26-C1E.5 P1).
 * 인증키·전체 API URL·원본 네트워크 오류 메시지·stack 을 절대 출력하지 않는다.
 * 안전한 내부 코드와 복구 경로만 노출한다.
 * @returns {string[]} 출력할 줄 목록
 */
export function formatCollectorError(error) {
  const lines = [];
  const safeMessage =
    error instanceof CollectorError || error instanceof AggregateError
      ? error.message
      : 'collector_failed';
  lines.push(`[FAIL] ${safeMessage}`);

  const recovery = error?.recovery;
  if (recovery) {
    lines.push('  정본 교체에 실패했습니다.');
    if (recovery.mixedGenerationPossible) {
      lines.push('  ⚠ 일부 파일 복원에 실패해 정본이 혼합 세대일 수 있습니다. 수동 확인이 필요합니다.');
    } else {
      lines.push('  이전 세대로 복원했습니다.');
    }
    lines.push(`  정본 경로   : ${recovery.artifactDir}`);
    lines.push(`  보존된 백업 : ${recovery.backupDir ?? '(복구 성공으로 제거됨)'}`);
    for (const [name, st] of Object.entries(recovery.fileStates ?? {})) {
      const status = !st.replacementApplied
        ? 'not_replaced'
        : st.restoreSucceeded
          ? 'restored'
          : st.restoreAttempted
            ? 'restore_failed'
            : 'restore_not_attempted';
      lines.push(`    - ${name}: ${status}`);
    }
  }
  if (error instanceof AggregateError) {
    // 하위 오류도 메시지만 사용한다. stack·원문 네트워크 메시지는 출력하지 않는다.
    lines.push(`  집계된 오류 ${error.errors.length}건:`);
    for (const e of error.errors) lines.push(`    · ${e?.message ?? 'unknown'}`);
  }
  return lines;
}

// 테스트가 생산 함수를 직접 import 할 수 있도록, 직접 실행일 때만 main 을 돌린다.
const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  runCollector().catch((error) => {
    console.error(`\n${formatCollectorError(error).join('\n')}`);
    process.exitCode = 1;
  });
}
