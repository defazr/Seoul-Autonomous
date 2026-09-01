/**
 * RT-2 — 실시간 도착정보 프록시 (approved server-side arrival proxy only).
 *
 * 잠금 예외 범위 (포그린 승인 2026-09-01):
 *   허용: 이 Route Handler 에서 서울시 버스 API 를 서버 측으로 호출하는 것.
 *   금지: 브라우저 → 서울시 API 직접 호출 / ServiceKey 클라이언트 노출 /
 *         버스위치(position) API / RT-3 지도 / 다른 realtime endpoint 로의 확대.
 *
 * 계약:
 *   - ServiceKey 는 이 계층에만 존재한다. 응답 어디에도 싣지 않는다.
 *   - 승인된 Stop 만 조회한다. 임의 arsId 로 우리 서버가 공개 버스 API 프록시가 되면 안 된다.
 *   - 인증·쿼터·timeout·budget 은 "정상 데이터 부재"와 절대 같은 상태가 아니다.
 *     사용자에게는 동일한 D 화면이어도 내부 reason 은 분리 유지한다.
 */

import { NextResponse } from 'next/server';
import { getApprovedStopPath } from '../../../../lib/stop-pages';
import {
  ROUTE_ID_BY_BUS_ROUTE_ID,
  classifyArrmsg,
  type ArrivalItem,
  type ArrivalPayload,
  type FailureReason,
} from '../../../../lib/realtime/arrival-registry';

const UPSTREAM_BASE = 'http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid';
const TIMEOUT_MS = 3000;
const CACHE_TTL_MS = 20_000;

/**
 * process-local upstream safety budget.
 * 공식 개발계정 한도는 상세기능당 1,000/day 이며, 이 키는 다른 운영 서비스와 공용이다.
 * 따라서 우리 앱이 한도를 독점하지 않도록 30% 에서 시작한다.
 * ⚠ 프로세스 재시작 시 초기화될 수 있으므로 global hard quota guarantee 가 아니다.
 */
const DEFAULT_DAILY_BUDGET = 300;

/** 개발 전용 fixture 주입. production 에서는 하드 가드로 무력화된다 (fail-closed). */
const FAKE_UPSTREAM = process.env.RT2_FAKE_UPSTREAM ?? '';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/** budget=0 경로를 QA 하기 위한 개발 전용 override. production 에서는 무시된다. */
const DAILY_BUDGET =
  !IS_PRODUCTION && process.env.RT2_BUDGET_OVERRIDE
    ? Number(process.env.RT2_BUDGET_OVERRIDE)
    : DEFAULT_DAILY_BUDGET;

type CacheEntry = { payload: ArrivalPayload; expiresAt: number };

const cache = new Map<string, CacheEntry>();
/** single-flight: 동일 stopId 의 동시 cache miss 를 한 요청으로 합류시킨다 (초당 한도 회피). */
const inFlight = new Map<string, Promise<ArrivalPayload | FailureReason>>();

/** budget 카운터. 날짜 bucket 은 컨테이너 TZ 에 의존하지 않고 KST 로 직접 계산한다. */
let budgetBucket = '';
let budgetUsed = 0;

/** 컨테이너가 UTC 여도 Asia/Seoul 기준 날짜를 반환한다 (UTC+9 고정, 한국은 DST 없음). */
function kstDateKey(now = Date.now()): string {
  return new Date(now + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function budgetRemaining(): number {
  const today = kstDateKey();
  if (budgetBucket !== today) {
    budgetBucket = today;
    budgetUsed = 0;
  }
  return DAILY_BUDGET - budgetUsed;
}

/** upstream 요청을 실제로 시작할 때만 차감한다. 실패해도 이미 호출했으므로 차감한다. */
function consumeBudget(): void {
  budgetUsed += 1;
}

function tagOf(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].trim() : '';
}

/** 인증·쿼터 오류를 "정상 데이터 부재"와 구분한다. 이 분기를 합치면 거짓말이 된다. */
function detectUpstreamFailure(xml: string): FailureReason | null {
  if (/SERVICE_KEY_IS_NOT_REGISTERED|SERVICE_ACCESS_DENIED|DEADLINE_HAS_EXPIRED|PERMISSION_DENIED|returnAuthMsg/.test(xml)) {
    return 'AUTH_ERROR';
  }
  if (/LIMITED_NUMBER_OF_SERVICE_REQUESTS/.test(xml)) return 'UPSTREAM_QUOTA';
  const headerCd = tagOf(xml, 'headerCd');
  // headerCd 4 = "결과가 없습니다" — 정상 응답이며 장애가 아니다.
  if (headerCd !== '' && headerCd !== '0' && headerCd !== '4') return 'UPSTREAM_ERROR';
  return null;
}

/**
 * upstream adapter. QA 는 이 경계에서만 대체되므로 실제 서울시 호출 없이 D 3경로를 재현한다.
 * production 에서 fixture 플래그가 감지되면 fake 데이터도 실제 호출도 하지 않는다 (fail-closed).
 */
async function fetchUpstream(arsId: string): Promise<{ xml: string } | { reason: FailureReason }> {
  if (FAKE_UPSTREAM) {
    if (IS_PRODUCTION) {
      // 실수로 production 에 플래그가 들어와도 fake 데이터도 실제 호출도 하지 않는다 (fail-closed).
      console.error('[rt2] CONFIG_ERROR: RT2_FAKE_UPSTREAM set in production; refusing upstream call');
      return { reason: 'CONFIG_ERROR' };
    }
    if (FAKE_UPSTREAM === 'timeout') return { reason: 'TIMEOUT' };
    // 동적 import — fixture 는 production 번들의 실행 경로에 들어가지 않는다.
    const { FIXTURES } = await import('../../../../lib/realtime/dev-fixtures');
    const xml = FIXTURES[FAKE_UPSTREAM];
    if (!xml) {
      console.error(`[rt2] CONFIG_ERROR: unknown RT2_FAKE_UPSTREAM=${FAKE_UPSTREAM}`);
      return { reason: 'CONFIG_ERROR' };
    }
    return { xml };
  }

  const key = process.env.BUS_API_SERVICE_KEY;
  if (!key) {
    console.error('[rt2] CONFIG_ERROR: BUS_API_SERVICE_KEY is not set');
    return { reason: 'CONFIG_ERROR' };
  }

  // 🔒 budget 은 실제 upstream request 를 시작하기 직전에만 차감한다.
  //    fixture · cache hit · single-flight follower 는 upstream 호출이 0 이므로 차감하지 않는다.
  //    (요청이 시작된 뒤라면 실패해도 차감은 유지한다 — 이미 상대 서버를 때렸다.)
  consumeBudget();
  console.info(`[rt2] upstream call stop=${arsId} budget=${budgetUsed}/${DAILY_BUDGET}`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${UPSTREAM_BASE}?ServiceKey=${encodeURIComponent(key)}&arsId=${arsId}`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    const xml = await res.text();
    if (!res.ok) return { reason: 'UPSTREAM_ERROR' };
    return { xml };
  } catch (error) {
    const aborted = error instanceof Error && error.name === 'AbortError';
    return { reason: aborted ? 'TIMEOUT' : 'UPSTREAM_ERROR' };
  } finally {
    clearTimeout(timer);
  }
}

function parseItems(xml: string): ArrivalItem[] {
  const blocks = [...xml.matchAll(/<itemList>([\s\S]*?)<\/itemList>/g)].map((m) => m[1]);
  const items: ArrivalItem[] = [];
  for (const block of blocks) {
    const busRouteId = tagOf(block, 'busRouteId');
    const routeId = ROUTE_ID_BY_BUS_ROUTE_ID[busRouteId];
    // 승인 노선이 아니면 버린다. 정류장에는 우리와 무관한 노선이 훨씬 많이 온다.
    if (!routeId) continue;
    const raw = tagOf(block, 'arrmsg1');
    items.push({ routeId, busRouteId, raw, ...classifyArrmsg(raw) });
  }
  return items;
}

async function loadArrivals(stopId: string): Promise<ArrivalPayload | FailureReason> {
  if (budgetRemaining() <= 0) {
    console.warn(`[rt2] APP_BUDGET_EXHAUSTED stop=${stopId} used=${budgetUsed}/${DAILY_BUDGET}`);
    return 'APP_BUDGET_EXHAUSTED';
  }

  // 차감은 fetchUpstream 안쪽, 실제 요청 직전에서 일어난다 (fixture 경로는 차감 0).
  const result = await fetchUpstream(stopId);
  if ('reason' in result) {
    console.warn(`[rt2] upstream failed stop=${stopId} reason=${result.reason}`);
    return result.reason;
  }

  const failure = detectUpstreamFailure(result.xml);
  if (failure) {
    console.warn(`[rt2] upstream failed stop=${stopId} reason=${failure}`);
    return failure;
  }

  const items = parseItems(result.xml);
  if (items.length === 0) {
    // 정상 응답인데 승인 노선이 하나도 없다 — 노선 개편·identity drift 의 조기 신호다.
    console.warn(`[rt2] anomaly: zero approved routes at stop=${stopId}`);
  }
  return { stopId, fetchedAt: Date.now(), items };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ stopId: string }> },
) {
  const { stopId } = await context.params;

  // 승인 Stop 게이트. 임의 arsId 를 프록시하지 않는다.
  if (!getApprovedStopPath(stopId)) {
    return NextResponse.json({ reason: 'UPSTREAM_ERROR' }, { status: 404 });
  }

  const cached = cache.get(stopId);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.payload, { headers: { 'Cache-Control': 'no-store' } });
  }

  let pending = inFlight.get(stopId);
  if (!pending) {
    pending = loadArrivals(stopId).finally(() => inFlight.delete(stopId));
    inFlight.set(stopId, pending);
  }
  const result = await pending;

  if (typeof result === 'string') {
    return NextResponse.json({ reason: result }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }

  cache.set(stopId, { payload: result, expiresAt: Date.now() + CACHE_TTL_MS });
  return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
}
