/**
 * Stage-1 discovery 관측 — 순수 분석 코어.
 *
 * 네트워크를 사용하지 않는다. GSC 호출은 scripts/observe-gsc-discovery.mjs 가 담당하고
 * 이 파일은 응답 해석·기준선 대조·집계만 한다 (로직 중복 구현 금지 계약).
 *
 * 설계 계약 — 2026-09-10 관측 도구 결함 2건의 재발 방지선이다.
 *   결함 1  기준선 키 15자 / 조회 키 16자로 잘라 비교 → 전건 미매치.
 *           → 길이 기반 slice 자체를 금지한다. 양쪽 모두 canonicalKey() 를 통과시킨다.
 *   결함 2  계약 필드 verdict 를 출력에서 누락 → 회차 기록이 불완전해졌다.
 *           → CONTRACT_FIELDS 3종은 항상 만든다. 없는 값을 빈 문자열로 메우지 않고
 *             ABSENT / EMPTY / NULL 을 구별해 보존한다.
 *
 * 해석 계약: coverageState 변화는 **시점 간 보고값 비교**로만 표현한다.
 * UNKNOWN → Discovered / Discovered → UNKNOWN 을 Google 내부 상태의 실제
 * 진전·후퇴로 해석하지 않는다. 정본 docs/worklogs/STAGE1-DISCOVERY-T0-20260907.md §14.
 */

import { fileURLToPath } from 'node:url';

export const UNKNOWN_COVERAGE = 'URL is unknown to Google';
export const CONTRACT_FIELDS = ['coverageState', 'verdict', 'lastCrawlTime'];

export const VALUE = 'VALUE';
export const ABSENT = 'ABSENT';
export const EMPTY = 'EMPTY';
export const NULL = 'NULL';

const MISSING_LABEL = {
  [ABSENT]: '미제공(응답에 필드 없음)',
  [EMPTY]: '빈 문자열',
  [NULL]: 'null',
};

/** Stage-1 승인 Stop 14 URL 의 canonical path. sitemap 실물과 대조해 쓴다. */
export const STAGE1_STOP_PATHS = [
  '/en/stops/01007-seoul-museum-of-history-gyeonghuigung-palace',
  '/en/stops/01008-seoul-museum-of-history-gyeonghuigung-palace',
  '/en/stops/01009-gwanghwamun-station',
  '/en/stops/01010-gwanghwamun-station',
  '/en/stops/01013-jongno-2-ga',
  '/en/stops/01014-jongno-2-ga',
  '/en/stops/01019-jongno-5-o-ga-gwangjang-market',
  '/ko/stops/01007-seoul-museum-of-history-gyeonghuigung-palace',
  '/ko/stops/01008-seoul-museum-of-history-gyeonghuigung-palace',
  '/ko/stops/01009-gwanghwamun-station',
  '/ko/stops/01010-gwanghwamun-station',
  '/ko/stops/01013-jongno-2-ga',
  '/ko/stops/01014-jongno-2-ga',
  '/ko/stops/01019-jongno-5-o-ga-gwangjang-market',
];

/**
 * 관측 이력. 다음 회차의 기준선이자 테스트 fixture 다.
 * 판정에 필요한 공개 정보(경로 + coverageState 분류)만 담는다 —
 * token·service account key·authorization header·원시 응답 전문은 넣지 않는다.
 */
export const OBSERVATION_HISTORY = {
  '2026-09-07T13:28+09:00': {
    label: 'T0 gate',
    note: '14/14 UNKNOWN. 최초 기준 상태로 역사적으로 유지한다.',
    states: Object.fromEntries(STAGE1_STOP_PATHS.map((p) => [p, 'UNKNOWN'])),
    lastCrawlTimeCount: 0,
    verdictRecorded: true,
  },
  '2026-09-09T08:14+09:00': {
    label: 'T+42.8h',
    note: 'Discovered 10 / UNKNOWN 4. verdict 14/14 NEUTRAL.',
    states: Object.fromEntries(STAGE1_STOP_PATHS.map((p) => [
      p,
      [
        '/en/stops/01007-seoul-museum-of-history-gyeonghuigung-palace',
        '/en/stops/01008-seoul-museum-of-history-gyeonghuigung-palace',
        '/en/stops/01009-gwanghwamun-station',
        '/ko/stops/01007-seoul-museum-of-history-gyeonghuigung-palace',
      ].includes(p) ? 'UNKNOWN' : 'DISCOVERED',
    ])),
    lastCrawlTimeCount: 0,
    verdictRecorded: true,
  },
  '2026-09-10T14:01+09:00': {
    label: 'T+72.6h',
    note: 'Discovered 9 / UNKNOWN 5. verdict 미기록(계약 필드 누락) — 부분 불완전 기록.',
    states: Object.fromEntries(STAGE1_STOP_PATHS.map((p) => [
      p,
      [
        '/en/stops/01009-gwanghwamun-station',
        '/en/stops/01013-jongno-2-ga',
        '/en/stops/01014-jongno-2-ga',
        '/ko/stops/01010-gwanghwamun-station',
        '/ko/stops/01019-jongno-5-o-ga-gwangjang-market',
      ].includes(p) ? 'UNKNOWN' : 'DISCOVERED',
    ])),
    lastCrawlTimeCount: 0,
    verdictRecorded: false,
  },
};

/**
 * Stage-1 discovery 판정의 **역사적 anchor**. 직전 비교 기준선과 섞지 않는다.
 * T0 의 14/14 UNKNOWN 이 "발견 0" 상태이며, 전체 판정은 항상 이 지점과 대조한다.
 * 09-09 의 10/4 와 09-10 의 9/5 차이는 **선형 진전·후퇴 판정에 쓰지 않는다.**
 * 관측 스냅샷의 역사적 시점이므로 값을 고정한다 (current-state 로 변하는 값이 아니다).
 */
export const DECISION_ANCHOR_AT = '2026-09-07T13:28+09:00';

/** 판정 기준점(T0)을 돌려준다. latestBaseline() 과 용도가 다르다. */
export function decisionAnchor(history = OBSERVATION_HISTORY) {
  const entry = history[DECISION_ANCHOR_AT];
  if (!entry) throw new Error(`판정 anchor 가 이력에 없다: ${DECISION_ANCHOR_AT}`);
  return { at: DECISION_ANCHOR_AT, ...entry };
}

/** 직전 상태 **비교 기준선**. 판정 anchor 가 아니다. */
export function latestBaseline(history = OBSERVATION_HISTORY) {
  const keys = Object.keys(history).sort();
  if (keys.length === 0) throw new Error('관측 이력이 비어 있다');
  const at = keys[keys.length - 1];
  return { at, ...history[at] };
}

/**
 * 전체 URL 이든 path 든 동일한 비교 키로 정규화한다.
 * 길이 기반 slice 를 쓰지 않는다 (결함 1 재발 방지선).
 */
export function canonicalKey(urlOrPath) {
  if (typeof urlOrPath !== 'string' || urlOrPath.trim() === '') {
    throw new TypeError(`URL 또는 path 가 필요하다: ${JSON.stringify(urlOrPath)}`);
  }
  let path;
  if (/^https?:\/\//i.test(urlOrPath)) {
    path = new URL(urlOrPath).pathname;
  } else {
    path = urlOrPath.split('?')[0].split('#')[0];
  }
  if (!path.startsWith('/')) path = `/${path}`;
  while (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path;
}

/** 필드 없음 / null / 빈 문자열을 정상값과 섞지 않는다 (결함 2 재발 방지선). */
export function readField(result, key) {
  if (result === null || typeof result !== 'object' || !(key in result)) {
    return { status: ABSENT, value: null };
  }
  const value = result[key];
  if (value === null || value === undefined) return { status: NULL, value: null };
  if (typeof value === 'string' && value.trim() === '') return { status: EMPTY, value: null };
  return { status: VALUE, value };
}

export function renderField(field) {
  return field.status === VALUE ? field.value : MISSING_LABEL[field.status];
}

/** coverageState 문자열을 상태로 분류한다. 값이 없으면 NO_DATA — 임의 추정하지 않는다. */
export function classify(coverageField) {
  if (coverageField.status !== VALUE) return 'NO_DATA';
  const v = coverageField.value;
  if (v === UNKNOWN_COVERAGE) return 'UNKNOWN';
  if (v.startsWith('Discovered')) return 'DISCOVERED';
  if (v.startsWith('Crawled')) return 'CRAWLED';
  if (v.toLowerCase().includes('indexed')) return 'INDEXED';
  return 'OTHER';
}

/**
 * baseline: { path|url: state } · observations: [{ url, result }]
 * 관측된 모든 URL 에 대해 정확히 1개의 비교 행을 만든다.
 */
export function analyze(baseline, observations) {
  const base = new Map();
  for (const [k, v] of Object.entries(baseline ?? {})) base.set(canonicalKey(k), v);

  const rows = [];
  const seen = new Set();
  for (const obs of observations) {
    const key = canonicalKey(obs.url);
    if (seen.has(key)) throw new Error(`동일 URL 중복 관측: ${key}`);
    seen.add(key);

    const fields = {};
    for (const name of CONTRACT_FIELDS) {
      const f = readField(obs.result, name);
      fields[name] = { ...f, shown: renderField(f) };
    }
    const state = classify(fields.coverageState);
    const prev = base.has(key) ? base.get(key) : 'NO_BASELINE';
    rows.push({
      key,
      prev,
      state,
      delta: prev === state ? 'SAME' : `${prev}->${state}`,
      fields,
      crawlRecorded: fields.lastCrawlTime.status === VALUE,
    });
  }

  const stateCounts = {};
  const deltaCounts = {};
  for (const r of rows) {
    stateCounts[r.state] = (stateCounts[r.state] ?? 0) + 1;
    deltaCounts[r.delta] = (deltaCounts[r.delta] ?? 0) + 1;
  }
  const pick = (fn) => rows.filter(fn).map((r) => r.key).sort();

  return {
    rows,
    total: rows.length,
    stateCounts,
    deltaCounts,
    crawlRecordedCount: rows.filter((r) => r.crawlRecorded).length,
    verdictMissingCount: rows.filter((r) => r.fields.verdict.status !== VALUE).length,
    toDiscovered: pick((r) => r.prev === 'UNKNOWN' && r.state === 'DISCOVERED'),
    toUnknown: pick((r) => r.prev === 'DISCOVERED' && r.state === 'UNKNOWN'),
    sameUnknown: pick((r) => r.delta === 'SAME' && r.state === 'UNKNOWN'),
    sameDiscovered: pick((r) => r.delta === 'SAME' && r.state === 'DISCOVERED'),
  };
}

/**
 * anchor(T0) 의 UNKNOWN 에서 벗어난 URL 수.
 * Discovered 뿐 아니라 **Crawled·Indexed 계열도 이탈로 센다** — 크롤·색인까지 갔다면
 * 발견은 당연히 지난 단계이기 때문이다. 이 목록을 좁히면 진행이 오히려 누락된다.
 */
export const ESCAPED_STATES = ['DISCOVERED', 'CRAWLED', 'INDEXED'];

export function countEscapedFromUnknown(report) {
  return report.rows.filter(
    (r) => r.prev === 'UNKNOWN' && ESCAPED_STATES.includes(r.state),
  ).length;
}

/**
 * Decision 제1 입력 판정. 정본 §14.6.
 * lastCrawlTime 발생 건수만 본다 — coverageState 총계로 대체하지 않는다.
 */
export function crawlVerdict(report) {
  return report.crawlRecordedCount > 0
    ? { verdict: 'CRAWL STARTED', count: report.crawlRecordedCount }
    : { verdict: 'Search Console 기준 첫 crawl 기록 미확인', count: 0 };
}

/** 이 파일을 직접 실행하면 계약 요약만 출력한다 (네트워크·판정 없음). */
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`Stage-1 stop paths: ${STAGE1_STOP_PATHS.length}`);
  console.log(`관측 이력: ${Object.keys(OBSERVATION_HISTORY).join(', ')}`);
  console.log(`계약 필드: ${CONTRACT_FIELDS.join(', ')}`);
}
