#!/usr/bin/env node
/**
 * Stage-1 discovery 관측 도구 오프라인 테스트.
 *
 *   node scripts/test-gsc-discovery.mjs
 *
 * GSC·GA4 를 호출하지 않는다. fixture 만 사용하며 네트워크 없이 실행된다.
 * 새 테스트 프레임워크를 설치하지 않고 Node 기본 기능만 쓴다.
 *
 * fixture 에는 판정에 필요한 최소 필드만 넣는다 — 공개 URL path 와
 * coverageState / verdict / lastCrawlTime 뿐이다. OAuth token, service account key,
 * authorization header, 원시 응답 전문은 넣지 않는다.
 *
 * 케이스 1~10 은 2026-09-10 관측 도구 결함 2건의 회귀 방지선이다. 정본 §14.5.
 */

import { fileURLToPath } from 'node:url';
import {
  ABSENT,
  DECISION_ANCHOR_AT,
  OBSERVATION_HISTORY,
  STAGE1_STOP_PATHS,
  VALUE,
  analyze,
  canonicalKey,
  countEscapedFromUnknown,
  crawlVerdict,
  decisionAnchor,
  latestBaseline,
} from './lib/gsc-discovery-core.mjs';
import {
  ALLOWED_SITE, READONLY_SCOPE, WRITE_SCOPE, assertReadonlyScope,
} from './observe-gsc-discovery.mjs';

/** 던지면 true. 네트워크를 타지 않는 순수 검증 함수 전용. */
function throws(fn) {
  try { fn(); return false; } catch { return true; }
}

const UNK = 'URL is unknown to Google';
const DISC = 'Discovered - currently not indexed';
const CRAW = 'Crawled - currently not indexed';
const HOST = 'https://seoulautonomous.com';

let failed = 0;
function check(name, ok, detail = '') {
  console.log(`${ok ? 'PASS  ' : 'FAIL  '}${name}${detail ? `  | ${detail}` : ''}`);
  if (!ok) failed += 1;
}

// 1. UNKNOWN → Discovered
{
  const r = analyze({ '/ko/stops/01007-x': 'UNKNOWN' },
    [{ url: `${HOST}/ko/stops/01007-x`, result: { coverageState: DISC, verdict: 'NEUTRAL' } }]);
  check('1  UNKNOWN → Discovered 전환 감지',
    r.rows[0].delta === 'UNKNOWN->DISCOVERED' && r.toDiscovered.length === 1, r.rows[0].delta);
}

// 2. Discovered → UNKNOWN
{
  const r = analyze({ '/en/stops/01013-y': 'DISCOVERED' },
    [{ url: `${HOST}/en/stops/01013-y`, result: { coverageState: UNK, verdict: 'NEUTRAL' } }]);
  check('2  Discovered → UNKNOWN 역전 감지',
    r.rows[0].delta === 'DISCOVERED->UNKNOWN' && r.toUnknown.length === 1, r.rows[0].delta);
}

// 3. 동일 상태
{
  const r = analyze({ '/ko/stops/01008-z': 'DISCOVERED' },
    [{ url: `${HOST}/ko/stops/01008-z`, result: { coverageState: DISC, verdict: 'NEUTRAL' } }]);
  check('3  상태 동일 → SAME', r.rows[0].delta === 'SAME' && r.sameDiscovered.length === 1, r.rows[0].delta);
}

// 4. verdict NEUTRAL 존재
{
  const r = analyze({}, [{ url: `${HOST}/a`, result: { coverageState: DISC, verdict: 'NEUTRAL' } }]);
  const v = r.rows[0].fields.verdict;
  check('4  verdict NEUTRAL 존재 → 값 보존',
    v.status === VALUE && v.shown === 'NEUTRAL' && r.verdictMissingCount === 0, v.shown);
}

// 5. verdict 필드 없음
{
  const r = analyze({}, [{ url: `${HOST}/a`, result: { coverageState: DISC } }]);
  const v = r.rows[0].fields.verdict;
  check('5  verdict 누락 → 빈값 아닌 ABSENT 로 구별',
    v.status === ABSENT && v.value === null && v.shown.includes('미제공') && r.verdictMissingCount === 1, v.shown);
}

// 6. lastCrawlTime 없음
{
  const r = analyze({}, [{ url: `${HOST}/a`, result: { coverageState: DISC, verdict: 'NEUTRAL' } }]);
  const lc = r.rows[0].fields.lastCrawlTime;
  check('6  lastCrawlTime 없음 → ABSENT · crawl 미기록',
    lc.status === ABSENT && r.crawlRecordedCount === 0 && crawlVerdict(r).count === 0, lc.shown);
}

// 7. lastCrawlTime 최초 발생
{
  const r = analyze({ '/a': 'DISCOVERED' }, [{
    url: `${HOST}/a`,
    result: { coverageState: CRAW, verdict: 'NEUTRAL', lastCrawlTime: '2026-09-14T02:11:00Z' },
  }]);
  check('7  lastCrawlTime 최초 발생 → CRAWL STARTED 판정',
    r.rows[0].fields.lastCrawlTime.status === VALUE && r.rows[0].state === 'CRAWLED'
    && crawlVerdict(r).verdict === 'CRAWL STARTED',
    `${r.rows[0].state} / ${crawlVerdict(r).verdict}`);
}

// 8. 14 URL 입력 → 14행 · 키 중복 0
{
  const base = Object.fromEntries(STAGE1_STOP_PATHS.map((p, i) => [p, i % 2 ? 'UNKNOWN' : 'DISCOVERED']));
  const obs = STAGE1_STOP_PATHS.map((p, i) => ({
    url: `${HOST}${p}`, result: { coverageState: i % 3 ? DISC : UNK, verdict: 'NEUTRAL' },
  }));
  const r = analyze(base, obs);
  const uniq = new Set(r.rows.map((x) => x.key)).size;
  check('8  14 URL 입력 → 14 비교 행 · 키 중복 0',
    r.total === 14 && uniq === 14 && Object.values(r.stateCounts).reduce((a, b) => a + b, 0) === 14,
    `total=${r.total} uniq=${uniq}`);
}

// 9. [결함 1 회귀] 긴 slug 비교
{
  const p = '/en/stops/01007-seoul-museum-of-history-gyeonghuigung-palace';
  const r = analyze({ [p]: 'UNKNOWN' },
    [{ url: `${HOST}${p}`, result: { coverageState: DISC, verdict: 'NEUTRAL' } }]);
  check('9  [결함1 회귀] 긴 slug 도 NO_BASELINE 없이 정확 매칭',
    r.rows[0].prev === 'UNKNOWN' && r.rows[0].delta === 'UNKNOWN->DISCOVERED', `prev=${r.rows[0].prev}`);
}

// 10. [결함 1 회귀] 전체 URL == path 동일 canonical key
{
  const p = '/ko/stops/01009-gwanghwamun-station';
  check('10 [결함1 회귀] full URL == path 동일 canonical key',
    canonicalKey(`${HOST}${p}`) === canonicalKey(p)
    && canonicalKey(`${HOST}${p}/`) === p
    && canonicalKey(`${HOST}${p}?x=1`) === p);
}

// 11. 실측 재현 fixture — 2026-09-09 기준선 → 2026-09-10 관측
{
  const base = OBSERVATION_HISTORY['2026-09-09T08:14+09:00'];
  const today = OBSERVATION_HISTORY['2026-09-10T14:01+09:00'];
  // verdict 미기록 회차이므로 fixture 에도 verdict 를 넣지 않는다 (실제와 동일).
  const obs = STAGE1_STOP_PATHS.map((p) => ({
    url: `${HOST}${p}`,
    result: { coverageState: today.states[p] === 'UNKNOWN' ? UNK : DISC },
  }));
  const r = analyze(base.states, obs);
  const sum = r.toDiscovered.length + r.toUnknown.length + r.sameUnknown.length + r.sameDiscovered.length;
  check('11 [실측 재현] 09-09 → 09-10 : D9/U5 · 3+4+1+6=14 · crawl 0 · verdict 미기록 14',
    r.stateCounts.DISCOVERED === 9 && r.stateCounts.UNKNOWN === 5
    && r.toDiscovered.length === 3 && r.toUnknown.length === 4
    && r.sameUnknown.length === 1 && r.sameDiscovered.length === 6 && sum === 14
    && r.crawlRecordedCount === 0 && r.verdictMissingCount === 14,
    `D${r.stateCounts.DISCOVERED}/U${r.stateCounts.UNKNOWN} sum=${sum}`);

  check('11b [실측 재현] 그대로 Discovered 6건에 /ko/…01007 이 없다 (집계 오기 회귀)',
    !r.sameDiscovered.some((k) => k.startsWith('/ko/stops/01007'))
    && r.toDiscovered.includes('/ko/stops/01007-seoul-museum-of-history-gyeonghuigung-palace'));
}

// 12. T0 기준선은 14/14 UNKNOWN 으로 보존
{
  const t0 = OBSERVATION_HISTORY['2026-09-07T13:28+09:00'];
  check('12 T0 기준 상태 14/14 UNKNOWN 보존',
    Object.values(t0.states).every((s) => s === 'UNKNOWN') && Object.keys(t0.states).length === 14);
}

// 13. 다음 회차 기준선 = 가장 최근 관측
{
  const b = latestBaseline();
  check('13 latestBaseline() = 2026-09-10 T+72.6h',
    b.at === '2026-09-10T14:01+09:00' && b.verdictRecorded === false, `${b.at} ${b.label}`);
}

// 14~15. 안전 상수 (러너를 import 해도 네트워크 호출은 일어나지 않는다)
check('14 [안전] 발급 scope 상수가 readonly 단독', READONLY_SCOPE === `${WRITE_SCOPE}.readonly`);
check('15 [안전] 대상 property allowlist 고정', ALLOWED_SITE === 'https://seoulautonomous.com/');

// 16~19. OAuth scope 정확 일치 강제 — 토큰 발급·네트워크 이전에 BLOCK 되어야 한다
check('16 [scope] readonly 단독 → 통과',
  !throws(() => assertReadonlyScope(READONLY_SCOPE)));
check('17 [scope] readonly + webmasters write 혼합 → BLOCK',
  throws(() => assertReadonlyScope(`${READONLY_SCOPE} ${WRITE_SCOPE}`))
  && throws(() => assertReadonlyScope(`${WRITE_SCOPE} ${READONLY_SCOPE}`)));
check('18 [scope] webmasters write 단독 → BLOCK',
  throws(() => assertReadonlyScope(WRITE_SCOPE)));
check('19 [scope] readonly + 무관 scope / 빈 값 / 비문자열 → BLOCK',
  throws(() => assertReadonlyScope(`${READONLY_SCOPE} https://www.googleapis.com/auth/analytics.readonly`))
  && throws(() => assertReadonlyScope('')) && throws(() => assertReadonlyScope(null)));

// 20~21. 비교 기준선과 판정 anchor 는 서로 다른 축이다
{
  const b = latestBaseline();
  const a = decisionAnchor();
  const anchorUnknown = Object.values(a.states).filter((v) => v === 'UNKNOWN').length;
  check('20 [축분리] comparison baseline ≠ decision anchor',
    b.at !== a.at && b.at === '2026-09-10T14:01+09:00' && a.at === DECISION_ANCHOR_AT,
    `baseline=${b.at} anchor=${a.at}`);
  check('21 [축분리] decision anchor = T0 14/14 UNKNOWN (발견 0)',
    a.at === '2026-09-07T13:28+09:00' && anchorUnknown === 14, `${anchorUnknown}/14 UNKNOWN`);
}

// 22. anchor 대비 집계는 09-10 실측에서 9건이 UNKNOWN 을 벗어난 상태로 나온다
{
  const today = OBSERVATION_HISTORY['2026-09-10T14:01+09:00'];
  const obs = STAGE1_STOP_PATHS.map((p) => ({
    url: `${HOST}${p}`,
    result: { coverageState: today.states[p] === 'UNKNOWN' ? UNK : DISC },
  }));
  const vsAnchor = analyze(decisionAnchor().states, obs);
  check('22 [축분리] T0 anchor 대비 UNKNOWN 이탈 9 / 14 (직전 회차 대비 3과 다른 값)',
    countEscapedFromUnknown(vsAnchor) === 9 && vsAnchor.sameUnknown.length === 5,
    `이탈 ${countEscapedFromUnknown(vsAnchor)} · 잔존 ${vsAnchor.sameUnknown.length}`);
}

// 23. anchor 대비 집계 — T0 UNKNOWN 이던 URL 이 CRAWLED 계열이면 이탈로 센다
{
  const anchorStates = { '/ko/stops/01009-gwanghwamun-station': 'UNKNOWN' };
  const r = analyze(anchorStates, [{
    url: `${HOST}/ko/stops/01009-gwanghwamun-station`,
    result: { coverageState: CRAW, verdict: 'NEUTRAL', lastCrawlTime: '2026-09-14T02:11:00Z' },
  }]);
  check('23 [anchor집계] T0 UNKNOWN → CRAWLED 는 이탈 1 로 집계 (toDiscovered 에는 없음)',
    r.rows[0].state === 'CRAWLED' && countEscapedFromUnknown(r) === 1
    && r.toDiscovered.length === 0 && r.sameUnknown.length === 0,
    `state=${r.rows[0].state} 이탈=${countEscapedFromUnknown(r)} toDiscovered=${r.toDiscovered.length}`);
}

// 24. anchor 대비 집계 — T0 UNKNOWN 이던 URL 이 INDEXED 계열이면 이탈로 센다
{
  const anchorStates = { '/ko/stops/01013-jongno-2-ga': 'UNKNOWN' };
  const r = analyze(anchorStates, [{
    url: `${HOST}/ko/stops/01013-jongno-2-ga`,
    result: {
      coverageState: 'Submitted and indexed', verdict: 'PASS',
      lastCrawlTime: '2026-09-14T03:40:00Z',
    },
  }]);
  check('24 [anchor집계] T0 UNKNOWN → INDEXED 는 이탈 1 로 집계 (toDiscovered 에는 없음)',
    r.rows[0].state === 'INDEXED' && countEscapedFromUnknown(r) === 1
    && r.toDiscovered.length === 0 && r.sameUnknown.length === 0,
    `state=${r.rows[0].state} 이탈=${countEscapedFromUnknown(r)} toDiscovered=${r.toDiscovered.length}`);
}

// 25. 잔존 UNKNOWN 은 이탈로 세지 않는다 (23·24 의 대조군)
{
  const r = analyze({ '/en/stops/01009-gwanghwamun-station': 'UNKNOWN' },
    [{ url: `${HOST}/en/stops/01009-gwanghwamun-station`, result: { coverageState: UNK } }]);
  check('25 [anchor집계] T0 UNKNOWN → UNKNOWN 은 이탈 0 (대조군)',
    countEscapedFromUnknown(r) === 0 && r.sameUnknown.length === 1);
}

console.log('');
console.log(failed ? `BLOCK — 실패 ${failed}건` : '전항 PASS · 외부 API 호출 0 · fixture 전용');
if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(failed ? 1 : 0);
