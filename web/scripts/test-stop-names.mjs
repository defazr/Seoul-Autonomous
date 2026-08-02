#!/usr/bin/env node
/**
 * Round 26-C1E.3 — 수집기·검증기 오프라인 시나리오 테스트.
 *
 *   node scripts/test-stop-names.mjs
 *
 * 공식 API 를 호출하지 않는다. fixture 와 주입된 fetch 구현만 사용한다.
 * retry/timeout/게이트 테스트는 테스트 전용 복제 루프가 아니라
 * 실제 생산 함수(attemptFetch / fetchStation / collectFromApi / commitArtifacts)를 호출한다.
 * 새 테스트 프레임워크를 설치하지 않고 Node 기본 기능만 쓴다.
 * 산출물은 /tmp 임시 디렉터리에만 만들고 종료 시 정리한다. 프로덕션 정본은 읽기만 한다.
 */

import { readFileSync, writeFileSync, mkdtempSync, rmSync, mkdirSync, existsSync, cpSync, readdirSync, chmodSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { BASELINE, selectExactRow, stableStringify, validateArtifacts } from './lib/stop-names-core.mjs';
import { attemptFetch, fetchStation, collectFromApi, commitArtifacts, formatCollectorError } from './collect-stop-names.mjs';

const SCRIPTS = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = join(SCRIPTS, '..');
const PROD_DIR = join(WEB_ROOT, 'data/stops');
const ROUTES = JSON.parse(readFileSync(join(WEB_ROOT, 'data/routes.json'), 'utf8'));
const FILES = ['stop-names.json', 'stop-names.meta.json', 'stop-name-reviews.json'];

const results = [];
const record = (name, passed, detail = '', calls = '') => {
  results.push({ name, passed, detail, calls });
  console.log(`${passed ? '  PASS' : '  FAIL'}  ${name}${detail ? ` — ${detail}` : ''}${calls ? `  [생산함수: ${calls}]` : ''}`);
};

const workRoot = mkdtempSync(join(tmpdir(), 'stop-names-test-'));
process.on('exit', () => rmSync(workRoot, { recursive: true, force: true }));

const sha = (t) => createHash('sha256').update(t, 'utf8').digest('hex');
const newCase = (name) => {
  const d = join(workRoot, name);
  mkdirSync(d, { recursive: true });
  return d;
};
const writeFixture = (dir, fx) => {
  const p = join(dir, 'fixture.json');
  writeFileSync(p, JSON.stringify(fx, null, 2), 'utf8');
  return p;
};
const seedProdCopy = (dir, subset = FILES) => {
  const out = join(dir, 'out');
  mkdirSync(out, { recursive: true });
  for (const f of subset) cpSync(join(PROD_DIR, f), join(out, f));
  return out;
};
const snapshot = (dir) =>
  Object.fromEntries(FILES.map((f) => [f, existsSync(join(dir, f)) ? readFileSync(join(dir, f), 'utf8') : null]));
const runCollector = (args, env = {}) =>
  spawnSync(process.execPath, [join(SCRIPTS, 'collect-stop-names.mjs'), ...args], {
    cwd: WEB_ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });

function baseFixture() {
  const records = JSON.parse(readFileSync(join(PROD_DIR, 'stop-names.json'), 'utf8'));
  const reviews = JSON.parse(readFileSync(join(PROD_DIR, 'stop-name-reviews.json'), 'utf8'));
  const holdEn = new Map(
    reviews.filter((r) => r.reviewType === 'semantic_conflict').map((r) => [r.stopId, r.officialNameEn]),
  );
  const fx = {};
  for (const r of records) {
    fx[r.officialId] =
      r.matchStatus === 'unmatched'
        ? { kind: 'no_row' }
        : {
            kind: 'ok',
            nameKo: r.nameKoOfficial,
            nameEn: r.matchStatus === 'conflict_hold' ? holdEn.get(r.stopId) : r.nameEnOfficial,
          };
  }
  return fx;
}

/** 응답 스텁 (Response 유사 객체) */
const stubRes = (status, bodyText, { json } = {}) => ({
  status,
  ok: status >= 200 && status < 300,
  json: json ?? (async () => JSON.parse(bodyText)),
});
const okPayload = (id) =>
  JSON.stringify({
    ListBusStationMultilangInfo: {
      RESULT: { CODE: 'INFO-000' },
      row: [{ STATION_ID: id, STATION_NM: 'stub', STATION_NM_EN: 'Stub' }],
    },
  });

console.log('=== Round 26-C1E.3 오프라인 테스트 (공식 API 호출 0) ===\n');
const FX = baseFixture();
const PROD_BEFORE = snapshot(PROD_DIR);

// ───────── 기본 생성·재현 ─────────
{
  const dir = newCase('s1');
  const out = join(dir, 'out');
  const r = runCollector(['--fixture', writeFixture(dir, FX), '--out-dir', out, '--write']);
  const p = snapshot(out);
  record(
    '1. 정상 267건 — 현재 정본 재현',
    r.status === 0 &&
      p['stop-names.json'] === PROD_BEFORE['stop-names.json'] &&
      p['stop-name-reviews.json'] === PROD_BEFORE['stop-name-reviews.json'],
    `exit=${r.status}`,
    'main→buildArtifacts→validateArtifacts→commitArtifacts',
  );
}
{
  const dir = newCase('s2');
  const out = seedProdCopy(dir);
  const before = snapshot(out);
  const fx = structuredClone(FX);
  fx['01-002'] = { kind: 'ok', nameKo: '창경궁.서울대학교병원', nameEn: '  ' };
  const r = runCollector(['--fixture', writeFixture(dir, fx), '--out-dir', out, '--write']);
  record('2. matched 영문명 빈 값 — 실패 + 정본 불변', r.status !== 0 && JSON.stringify(before) === JSON.stringify(snapshot(out)), `exit=${r.status}`, 'fixtureResponses→hardFailures');
}
{
  const dir = newCase('s3');
  const out = seedProdCopy(dir);
  const before = snapshot(out);
  const fx = structuredClone(FX);
  let n = 0;
  for (const k of Object.keys(fx)) if (n < 100 && fx[k].kind === 'ok') { fx[k] = { kind: 'no_row' }; n += 1; }
  const r = runCollector(['--fixture', writeFixture(dir, fx), '--out-dir', out, '--write']);
  record('3. 대량 INFO-200(장애 위장) — 기준 보호 BLOCK', r.status !== 0 && JSON.stringify(before) === JSON.stringify(snapshot(out)), `exit=${r.status}`, 'main 기준선 가드');
}
{
  const dir = newCase('s4');
  const out = seedProdCopy(dir);
  const before = snapshot(out);
  const fx = structuredClone(FX);
  fx['01-003'] = { kind: 'no_row' };
  const w = runCollector(['--fixture', writeFixture(dir, fx), '--out-dir', out, '--write']);
  const rv = runCollector(['--fixture', writeFixture(dir, fx), '--out-dir', out, '--review-baseline-change']);
  record(
    '4. 추가 unmatched — BLOCK + 검토모드 읽기전용',
    w.status !== 0 && rv.status === 0 && /읽기 전용/.test(rv.stdout) && JSON.stringify(before) === JSON.stringify(snapshot(out)),
    `write=${w.status} review=${rv.status}`,
    'main 기준선 가드',
  );
}
{
  const dup = selectExactRow([{ STATION_ID: '01-005', STATION_NM: 'A', STATION_NM_EN: 'A' }, { STATION_ID: '01-005', STATION_NM: 'B', STATION_NM_EN: 'B' }], '01-005');
  const mixed = selectExactRow([{ STATION_ID: '99-999', STATION_NM: 'X', STATION_NM_EN: 'X' }, { STATION_ID: '01-005', STATION_NM: 'A', STATION_NM_EN: 'A' }], '01-005');
  const notArr = selectExactRow({ a: 1 }, '01-005');
  const emptyEn = selectExactRow([{ STATION_ID: '01-005', STATION_NM: 'A', STATION_NM_EN: '' }], '01-005');
  record('5. 행 선택 규칙 (중복/혼합/스키마/빈값)', dup.reason === 'duplicate_rows:2' && mixed.kind === 'ok' && mixed.ignoredRows === 1 && notArr.kind === 'permanent' && emptyEn.kind === 'permanent', '', 'selectExactRow');
}

// ───────── 검증기 우회 시도 (P1-①) ─────────
{
  const records = JSON.parse(readFileSync(join(PROD_DIR, 'stop-names.json'), 'utf8'));
  const reviews = JSON.parse(readFileSync(join(PROD_DIR, 'stop-name-reviews.json'), 'utf8'));
  const meta = JSON.parse(readFileSync(join(PROD_DIR, 'stop-names.meta.json'), 'utf8'));
  const { buildMeta } = await import('./lib/stop-names-core.mjs');
  /** 해시를 다시 계산해도 막히는지 확인한다 (Codex 가 뚫었던 방식 그대로) */
  const forge = (recs, rvs) => {
    const m = buildMeta({ records: recs, reviews: rvs, collectedAt: meta.collectedAt, apiMatched: meta.apiMatched, apiUnmatched: meta.apiUnmatched, requestedStopIds: meta.requestedStopIds });
    return validateArtifacts({ routesData: ROUTES, records: recs, reviews: rvs, meta: m, rawTexts: { names: stableStringify(recs), reviews: stableStringify(rvs) } });
  };

  const a = structuredClone(reviews); a.find((r) => r.stopId === '20169').decision = 'adopt_en';
  record('6. 위조: 20169 decision→adopt_en (해시 재계산)', forge(records, a).length > 0, `오류 ${forge(records, a).length}건`, 'validateArtifacts');

  const b = structuredClone(reviews); b.find((r) => r.stopId === '20169').officialNameEn = 'forged';
  record('7. 위조: 20169 공식 원문 변조 (해시 재계산)', forge(records, b).length > 0, `오류 ${forge(records, b).length}건`, 'validateArtifacts');

  const c = structuredClone(records); c.find((r) => r.stopId === '02247').nameEnOfficial = 'Injected';
  record('8. 위조: unmatched 에 영문명 삽입 (해시 재계산)', forge(c, reviews).length > 0, `오류 ${forge(c, reviews).length}건`, 'validateArtifacts');

  const d = structuredClone(records); d.find((r) => r.stopId === '01002').matchStatus = 'official_variant';
  record('9. 위조: 임의 stopId를 official_variant 로', forge(d, reviews).length > 0, `오류 ${forge(d, reviews).length}건`, 'validateArtifacts');

  const e = structuredClone(reviews); e.push({ ...e[0], stopId: '01002', reviewType: 'ko_name_difference', decision: 'adopt_en' });
  record('10. 위조: exact 에 review 추가', forge(records, e).length > 0, `오류 ${forge(records, e).length}건`, 'validateArtifacts');

  const f = structuredClone(records); f.find((r) => r.stopId === '01002').matchStatus = 'corrupt';
  record('11. 잘못된 matchStatus', forge(f, reviews).length > 0, `오류 ${forge(f, reviews).length}건`, 'validateArtifacts');

  const g = reviews.filter((r) => r.stopId !== '20169');
  record('12. review 누락', forge(records, g).length > 0, `오류 ${forge(records, g).length}건`, 'validateArtifacts');

  const h = [...reviews, { ...reviews[0], stopId: '99999' }];
  record('13. 고아 review', forge(records, h).length > 0, `오류 ${forge(records, h).length}건`, 'validateArtifacts');
}

// ───────── rollback (P1-② / P2-③) ─────────
const rollbackSteps = ['after_staging', 'after_backup', 'after_replace_1', 'after_replace_2', 'after_replace_3'];
for (const step of rollbackSteps) {
  const dir = newCase(`rb-${step}`);
  const out = seedProdCopy(dir);
  const before = snapshot(out);
  const fx = structuredClone(FX);
  fx['01-002'] = { kind: 'ok', nameKo: '창경궁.서울대병원', nameEn: "Changgyeonggung, Seoul Nat'l Univ. hospital" };
  const r = runCollector(['--fixture', writeFixture(dir, fx), '--out-dir', out, '--write'], { STOP_NAMES_INJECT_FAILURE: step });
  const after = snapshot(out);
  const complete = Object.values(after).every((v) => v !== null);
  const leftovers = readdirSync(out).filter((f) => f.startsWith('.staging-') || f.startsWith('.backup-'));
  record(
    `14. rollback ${step} — 이전 세대 복원 + 잔여물 0`,
    r.status !== 0 && complete && JSON.stringify(before) === JSON.stringify(after) && leftovers.length === 0,
    `exit=${r.status}, 잔여 ${leftovers.length}`,
    'commitArtifacts',
  );
}
{
  // 첫 생성 중 실패 → 부분 정본이 남지 않아야 함
  const dir = newCase('rb-fresh');
  const out = join(dir, 'out');
  const r = runCollector(['--fixture', writeFixture(dir, FX), '--out-dir', out, '--write'], { STOP_NAMES_INJECT_FAILURE: 'after_replace_2' });
  const after = snapshot(out);
  const anyLeft = Object.values(after).some((v) => v !== null);
  record('15. 첫 생성 중 실패 — 부분 정본 잔존 0', r.status !== 0 && !anyLeft, `exit=${r.status}`, 'commitArtifacts');
}
for (const [label, failStep, targetFile] of [
  ['첫 파일', 'after_replace_1', 'stop-names.json'],
  ['둘째 파일', 'after_replace_2', 'stop-names.meta.json'],
]) {
  // 복원 '쓰기' 실패: 교체된 파일 자체를 읽기 전용으로 만들어 복원 write 를 실패시킨다.
  const dir = newCase(`rb-restore-fail-${failStep}`);
  const out = seedProdCopy(dir);
  const before = snapshot(out);
  const target = join(out, targetFile);
  const res = commitArtifacts(out, { names: 'X', meta: 'Y', reviews: 'Z' }, (step) => {
    if (step === failStep) {
      chmodSync(target, 0o400);
      throw new Error(`주입된 실패: ${failStep}`);
    }
  });
  chmodSync(target, 0o600);
  const sawOriginal = new RegExp(failStep).test(res.error?.message ?? '');
  const aggregated = res.aggregate instanceof AggregateError && res.aggregate.errors.includes(res.error);
  // ★ 복구 실패 시 백업이 보존돼야 한다 (26-C1E.4 P1) — 정리 전에 먼저 단언한다.
  const backupKept = Boolean(res.backupDir) && existsSync(res.backupDir);
  const backupHasAll = backupKept && FILES.every((f) => existsSync(join(res.backupDir, f)));
  const backupMatchesPrev =
    backupHasAll && FILES.every((f) => readFileSync(join(res.backupDir, f), 'utf8') === before[f]);
  const errHasPath = res.aggregate?.recovery?.backupDir === res.backupDir && Boolean(res.aggregate?.recovery?.artifactDir);
  // 복원 실패한 파일 외 다른 파일은 복원 시도가 계속됐는가
  const applied = [...res.state.values()].filter((s) => s.replacementApplied);
  const allAttempted = applied.every((s) => s.restoreAttempted);
  const onlyOneFailed = applied.filter((s) => !s.restoreSucceeded).length === 1;
  record(
    `16. 복원 실패(${label}) — 백업 보존 + 이전 세대 내용 일치 + 오류에 경로 포함`,
    res.ok === false && sawOriginal && res.restoreFailed === true && aggregated &&
      backupKept && backupHasAll && backupMatchesPrev && errHasPath && allAttempted && onlyOneFailed,
    `backup보존=${backupKept}, 3파일=${backupHasAll}, 내용일치=${backupMatchesPrev}, 경로포함=${errHasPath}, 교체${applied.length}건 전부복원시도=${allAttempted}, 실패1건만=${onlyOneFailed}`,
    'commitArtifacts',
  );
}
{
  // 정리(cleanup) 실패는 복원 성공을 뒤집지 않아야 한다.
  const dir = newCase('rb-cleanup-fail');
  const out = seedProdCopy(dir);
  const before = snapshot(out);
  const res = commitArtifacts(out, { names: 'X', meta: 'Y', reviews: 'Z' }, (step) => {
    if (step === 'after_replace_1') {
      chmodSync(out, 0o500); // 디렉터리 쓰기 불가 → staging/backup 제거 실패
      throw new Error('주입된 실패: cleanup');
    }
  });
  chmodSync(out, 0o700);
  const restored = readFileSync(join(out, 'stop-names.json'), 'utf8') === before['stop-names.json'];
  record(
    '16b. 정리 실패 — 복원은 성공, 원래 오류 보존',
    res.ok === false && restored && res.restoreFailed === false && (res.recoveryErrors?.length ?? 0) > 0,
    `복원=${restored}, restoreFailed=${res.restoreFailed}, 복구오류 ${res.recoveryErrors?.length ?? 0}건`,
    'commitArtifacts',
  );
}
{
  // 부분 정본 상태 → 쓰기 차단, 롤백 진입 없음
  const dir = newCase('partial');
  const out = seedProdCopy(dir, ['stop-names.json', 'stop-names.meta.json']);
  const before = snapshot(out);
  const r = runCollector(['--fixture', writeFixture(dir, FX), '--out-dir', out, '--write']);
  record('17. 부분 정본 — 쓰기 차단 + 불변', r.status !== 0 && /부분적으로만 존재/.test(r.stderr) && JSON.stringify(before) === JSON.stringify(snapshot(out)), `exit=${r.status}`, 'readCurrentArtifacts');
}

// ───────── no-op 손상 검출 (P1-③) ─────────
const corruptions = [
  ['meta artifact hash 변조', (o) => { const m = JSON.parse(readFileSync(join(o, 'stop-names.meta.json'), 'utf8')); m.artifacts.stopNamesSha256 = 'deadbeef'; writeFileSync(join(o, 'stop-names.meta.json'), stableStringify(m)); }],
  ['generationId 변조', (o) => { const m = JSON.parse(readFileSync(join(o, 'stop-names.meta.json'), 'utf8')); m.generationId = 'ffffffffffffffff'; writeFileSync(join(o, 'stop-names.meta.json'), stableStringify(m)); }],
  ['reviews decision 변조', (o) => { const rv = JSON.parse(readFileSync(join(o, 'stop-name-reviews.json'), 'utf8')); rv.find((r) => r.stopId === '20169').decision = 'adopt_en'; writeFileSync(join(o, 'stop-name-reviews.json'), stableStringify(rv)); }],
  ['reviews 공식 원문 변조', (o) => { const rv = JSON.parse(readFileSync(join(o, 'stop-name-reviews.json'), 'utf8')); rv.find((r) => r.stopId === '20169').officialNameEn = 'forged'; writeFileSync(join(o, 'stop-name-reviews.json'), stableStringify(rv)); }],
  ['파일 바이트(공백) 변조', (o) => { const t = readFileSync(join(o, 'stop-names.json'), 'utf8'); writeFileSync(join(o, 'stop-names.json'), `${t}\n`); }],
];
for (const [label, corrupt] of corruptions) {
  const dir = newCase(`noop-${label.replace(/[^a-z]/gi, '')}`);
  const out = seedProdCopy(dir);
  corrupt(out);
  const before = snapshot(out);
  const r = runCollector(['--fixture', writeFixture(dir, FX), '--out-dir', out, '--write']);
  record(`18. no-op 손상 검출: ${label}`, r.status !== 0 && JSON.stringify(before) === JSON.stringify(snapshot(out)), `exit=${r.status}`, 'main→validateArtifacts(기존 정본)');
}

// ───────── 실제 생산 retry/timeout/게이트 (P1-④ / P2-④) ─────────
{
  let calls = 0;
  const fetchImpl = async (url) => { calls += 1; return calls === 1 ? stubRes(500, 'err') : stubRes(200, okPayload('01-005')); };
  const res = await fetchStation('k', '01-005', { fetchImpl, backoff: async () => {} });
  record('19. 500→200 재시도 — 생산 fetchStation, 호출 2회', res.kind === 'ok' && calls === 2, `calls=${calls}`, 'fetchStation→attemptFetch');
}
{
  let calls = 0;
  const fetchImpl = async (url, opts) => {
    calls += 1;
    if (calls === 1) return new Promise((_, rej) => opts.signal.addEventListener('abort', () => rej(Object.assign(new Error('aborted'), { name: 'AbortError' }))));
    return stubRes(200, okPayload('01-005'));
  };
  const res = await fetchStation('k', '01-005', { fetchImpl, timeoutMs: 50, backoff: async () => {} });
  record('20. timeout→성공 재시도 — 생산 경로', res.kind === 'ok' && calls === 2, `calls=${calls}`, 'fetchStation→attemptFetch(AbortController)');
}
{
  let calls = 0;
  const fetchImpl = async () => { calls += 1; if (calls === 1) throw new Error('ECONNRESET'); return stubRes(200, okPayload('01-005')); };
  const res = await fetchStation('k', '01-005', { fetchImpl, backoff: async () => {} });
  record('21. 네트워크 예외→성공 재시도', res.kind === 'ok' && calls === 2, `calls=${calls}`, 'fetchStation');
}
{
  let calls = 0;
  const fetchImpl = async () => { calls += 1; return stubRes(200, JSON.stringify({ RESULT: { CODE: 'INFO-100' } })); };
  const res = await fetchStation('k', '01-005', { fetchImpl, backoff: async () => {} });
  record('22. 인증 오류 — 재시도 0회', res.kind === 'permanent' && res.reason === 'authentication_failed' && calls === 1, `calls=${calls}`, 'fetchStation');
}
{
  let calls = 0;
  const fetchImpl = async () => { calls += 1; return stubRes(400, 'bad'); };
  const res = await fetchStation('k', '01-005', { fetchImpl, backoff: async () => {} });
  record('23. 요청 형식 오류(400) — 재시도 0회', res.kind === 'permanent' && calls === 1, `calls=${calls}`, 'fetchStation');
}
{
  let calls = 0;
  const fetchImpl = async () => { calls += 1; return { status: 200, ok: true, json: async () => { throw new SyntaxError('Unexpected token <'); } }; };
  const res = await fetchStation('k', '01-005', { fetchImpl, backoff: async () => {} });
  record('24. 200 + 깨진 JSON — 재시도 0회 (P2-② 수정)', res.kind === 'permanent' && res.reason === 'invalid_response_json' && calls === 1, `calls=${calls}, reason=${res.reason}`, 'fetchStation→attemptFetch');
}
{
  let calls = 0;
  const fetchImpl = async () => { calls += 1; return stubRes(500, 'x', { json: async () => { throw new SyntaxError('html'); } }); };
  const res = await fetchStation('k', '01-005', { fetchImpl, backoff: async () => {} });
  record('25. 500 + HTML — 5xx 정책으로 재시도', res.kind === 'transient' && calls === 3, `calls=${calls} (MAX_ATTEMPTS)`, 'fetchStation');
}
{
  let calls = 0;
  const fetchImpl = async () => { calls += 1; return stubRes(200, JSON.stringify({ ListBusStationMultilangInfo: { RESULT: { CODE: 'INFO-000' }, row: [{ STATION_ID: '01-005', STATION_NM: 'A', STATION_NM_EN: 'A' }, { STATION_ID: '01-005', STATION_NM: 'B', STATION_NM_EN: 'B' }] } })); };
  const res = await fetchStation('k', '01-005', { fetchImpl, backoff: async () => {} });
  record('26. exact ID 2행 — 즉시 실패, 재시도 0', res.kind === 'permanent' && res.reason === 'duplicate_rows:2' && calls === 1, `calls=${calls}`, 'fetchStation→selectExactRow');
}
{
  let calls = 0;
  const fetchImpl = async () => { calls += 1; return stubRes(200, JSON.stringify({ RESULT: { CODE: 'INFO-200' } })); };
  const res = await fetchStation('k', '01-005', { fetchImpl, backoff: async () => {} });
  record('27. INFO-200 — 최소 1회 재확인 후 no_row', res.kind === 'no_row' && calls === 2, `calls=${calls}`, 'fetchStation');
}
{
  // HTTP 게이트: 생산 함수를 같은 프로세스에서 호출해 fetch 호출 수를 '실제로' 계측한다 (P2-④).
  // 계측값을 얻지 못하면 통과로 인정하지 않는다.
  let calls = 0;
  const fetchImpl = async () => { calls += 1; return stubRes(200, okPayload('01-005')); };
  let threw = null;
  try {
    await collectFromApi(['01005'], { key: 'injected-key', allowInsecure: false, fetchImpl });
  } catch (e) {
    threw = e;
  }
  record(
    '28. HTTP 게이트(플래그 없음) — fetch 호출 실측 0건',
    threw !== null && /평문 HTTP/.test(threw.message ?? '') && calls === 0,
    `throw=${threw !== null}, 측정 fetch 호출=${calls}`,
    'collectFromApi',
  );
}
{
  // 키 없음 + 플래그 있음 → 역시 요청 0건
  let calls = 0;
  const fetchImpl = async () => { calls += 1; return stubRes(200, okPayload('01-005')); };
  let threw = null;
  try {
    await collectFromApi(['01005'], { key: null, allowInsecure: true, fetchImpl });
  } catch (e) {
    threw = e;
  }
  const before = snapshot(PROD_DIR);
  record(
    '28b. 키 없음(플래그 있음) — fetch 호출 실측 0건 + 정본 불변',
    threw !== null && calls === 0 && FILES.every((f) => sha(before[f]) === sha(PROD_BEFORE[f])),
    `throw=${threw !== null}, 측정 fetch 호출=${calls}`,
    'collectFromApi',
  );
}
{
  // 게이트 통과 시에는 실제로 요청이 나가는지 (반대 방향 확인)
  let calls = 0;
  const fetchImpl = async () => { calls += 1; return stubRes(200, okPayload('01-005')); };
  const out = await collectFromApi(['01005'], { key: 'k', allowInsecure: true, fetchImpl, backoff: async () => {}, intervalMs: 0 });
  record('29. 게이트 통과 — 요청 1건 발생, matched 1', calls === 1 && out.matched === 1, `calls=${calls}`, 'collectFromApi→fetchStation');
}

// ───────── 메타 타입·스키마 런타임 검증 (26-C1E.4 P2) ─────────
{
  const records = JSON.parse(readFileSync(join(PROD_DIR, 'stop-names.json'), 'utf8'));
  const reviews = JSON.parse(readFileSync(join(PROD_DIR, 'stop-name-reviews.json'), 'utf8'));
  const meta = JSON.parse(readFileSync(join(PROD_DIR, 'stop-names.meta.json'), 'utf8'));
  const raw = { names: readFileSync(join(PROD_DIR, 'stop-names.json'), 'utf8'), reviews: readFileSync(join(PROD_DIR, 'stop-name-reviews.json'), 'utf8') };
  const run = (m) => validateArtifacts({ routesData: ROUTES, records, reviews, meta: m, rawTexts: raw });

  const cases = [
    ['generationId 누락', (m) => { delete m.generationId; }],
    ['artifacts 누락', (m) => { delete m.artifacts; }],
    ['해시 필드 1개 누락', (m) => { delete m.artifacts.reviewsCanonicalSha256; }],
    ['해시가 문자열 아님', (m) => { m.artifacts.stopNamesSha256 = 12345; }],
    ['해시 형식 오류', (m) => { m.artifacts.stopNamesSha256 = 'not-a-sha'; }],
    ['숫자 필드가 문자열', (m) => { m.apiMatched = '262'; }],
  ];
  for (const [label, mutate] of cases) {
    const m = structuredClone(meta);
    mutate(m);
    const errs = run(m);
    record(`29. 메타 스키마: ${label} → 실패`, errs.length > 0, `오류 ${errs.length}건`, 'validateArtifacts');
  }
  record('29b. 실제 현재 meta → PASS', run(structuredClone(meta)).length === 0, '', 'validateArtifacts');
}

// ───────── 26-C1E.5: 복구 정보 CLI 전달 / 비밀정보 차단 / meta 필수 ─────────
{
  // runCollector → commitArtifacts → CLI formatter 전 구간을 통과시킨다.
  const dir = newCase('c1e5-cli-recovery');
  const out = seedProdCopy(dir);
  const target = join(out, 'stop-names.json');
  const fx = structuredClone(FX);
  fx['01-002'] = { kind: 'ok', nameKo: '창경궁.서울대병원', nameEn: "Changgyeonggung, Seoul Nat'l Univ. hospital" };
  const fxPath = writeFixture(dir, fx);
  // 자식 프로세스로 실제 CLI 를 실행하되, 복원 실패를 만들기 위해 교체 후 파일을 읽기 전용으로 만든다.
  const child = spawnSync(
    process.execPath,
    ['-e', `
      import('${join(SCRIPTS, 'collect-stop-names.mjs').replace(/\\\\/g, '/')}').then(async (m) => {
        const { chmodSync } = await import('node:fs');
        process.argv = [process.argv[0], '${join(SCRIPTS, 'collect-stop-names.mjs').replace(/\\\\/g, '/')}'];
        try {
          const payload = { names: 'X', meta: 'Y', reviews: 'Z' };
          const res = m.commitArtifacts('${out.replace(/\\\\/g, '/')}', payload, (step) => {
            if (step === 'after_replace_1') { chmodSync('${target.replace(/\\\\/g, '/')}', 0o400); throw new Error('주입된 실패'); }
          });
          if (!res.ok) { console.error(m.formatCollectorError(res.aggregate).join('\\n')); process.exitCode = 1; }
        } catch (e) { console.error(m.formatCollectorError(e).join('\\n')); process.exitCode = 1; }
      });
    `],
    { encoding: 'utf8' },
  );
  chmodSync(target, 0o600);
  const outText = `${child.stdout ?? ''}${child.stderr ?? ''}`;
  const hasBackup = /보존된 백업 : \S+/.test(outText) && !/제거됨/.test(outText);
  const hasArtifactDir = /정본 경로/.test(outText);
  const hasFileStates = /restore_failed/.test(outText) && /restored|not_replaced/.test(outText);
  const hasMixedWarn = /혼합 세대/.test(outText);
  record(
    '31. runCollector 경로 → CLI formatter 에 복구 정보 전달',
    child.status !== 0 && hasBackup && hasArtifactDir && hasFileStates && hasMixedWarn,
    `backup=${hasBackup}, 정본경로=${hasArtifactDir}, 파일상태=${hasFileStates}, 혼합경고=${hasMixedWarn}`,
    'commitArtifacts→formatCollectorError',
  );
}
{
  // 악성 네트워크 오류: 메시지에 키·URL 이 들어와도 최종 출력에 유출되지 않아야 한다.
  const SECRET = 'SECRET_API_KEY_ZZZ';
  const evil = new Error(`fetch failed for http://openapi.seoul.go.kr:8088/${SECRET}/xml/ListBusStationMultilangInfo/1/5/01-005/`);
  let calls = 0;
  const fetchImpl = async () => { calls += 1; throw evil; };
  const res = await fetchStation(SECRET, '01-005', { fetchImpl, backoff: async () => {} });
  const retriesInFetchStation = calls;
  const surface = JSON.stringify(res);
  let collectErr = null;
  try {
    await collectFromApi(['01005'], { key: SECRET, allowInsecure: true, fetchImpl, backoff: async () => {}, intervalMs: 0 });
  } catch (e) {
    collectErr = e;
  }
  const cliText = collectErr ? formatCollectorError(collectErr).join('\n') : '';
  const combined = `${surface}\n${cliText}`;
  const leaks = [SECRET, 'openapi.seoul.go.kr', 'http://', 'fetch failed for'].filter((s) => combined.includes(s));
  record(
    '32. 악성 네트워크 오류 — 키·URL·원문 유출 0',
    leaks.length === 0 && res.reason === 'network_request_failed' && retriesInFetchStation === 3,
    `유출 ${leaks.length}건${leaks.length ? `: ${leaks.join(', ')}` : ''}, reason=${res.reason}, 재시도 ${retriesInFetchStation}회(fetchStation) / 총 ${calls}회`,
    'fetchStation→collectFromApi→formatCollectorError',
  );
}
{
  const records = JSON.parse(readFileSync(join(PROD_DIR, 'stop-names.json'), 'utf8'));
  const reviews = JSON.parse(readFileSync(join(PROD_DIR, 'stop-name-reviews.json'), 'utf8'));
  const meta = JSON.parse(readFileSync(join(PROD_DIR, 'stop-names.meta.json'), 'utf8'));
  const run = (m) => validateArtifacts({ routesData: ROUTES, records, reviews, meta: m });
  for (const [label, value] of [['null', null], ['undefined', undefined], ['배열', []], ['문자열', 'x'], ['빈 객체', {}]]) {
    record(`33. meta ${label} → 검증 실패`, run(value).length > 0, `오류 ${run(value).length}건`, 'validateArtifacts');
  }
  record('33b. 정상 meta → PASS', run(structuredClone(meta)).length === 0, '', 'validateArtifacts');
}

// ───────── 프로덕션 정본 불변 확인 ─────────
{
  const after = snapshot(PROD_DIR);
  record('30. 프로덕션 정본 불변 (테스트 전후 SHA 동일)', FILES.every((f) => sha(PROD_BEFORE[f]) === sha(after[f])), FILES.map((f) => `${f.slice(0, 10)}=${sha(after[f]).slice(0, 8)}`).join(' '), '읽기 전용');
}

const failed = results.filter((r) => !r.passed);
console.log(`\n=== 결과: ${results.length - failed.length}/${results.length} 통과 ===`);
if (failed.length > 0) {
  for (const f of failed) console.error(`  FAILED: ${f.name} (${f.detail})`);
  process.exit(1);
}
