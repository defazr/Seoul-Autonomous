/**
 * RT-2 — 실시간 도착정보 identity 레지스트리 + arrmsg 분류.
 *
 * 계약 (docs/worklogs/RT2-ARRIVAL-CARD-DESIGN-20260901.md):
 *   - 노선 매칭은 언제나 `busRouteId` 리터럴이다. 노선명 문자열 매칭은 금지한다
 *     (RT-1 실측에서 routes.json 표기와 API `rtNm` 이 3건 달랐고,
 *      `strSrch=A21` 검색은 심야A21·상암A21 을 동시에 반환한다).
 *   - 이 목록은 Graph 에서 파생하지 않는다. `stop-pages.ts` 의 APPROVED_STOPS 와 같은 성격으로,
 *     승인된 노선만 실시간 계층에 올린다. 정류장 응답에는 우리와 무관한 노선이 함께 오며
 *     (01009 = 22개, 01013 = 31개) 그것까지 보여주면 일반 버스 앱이 된다.
 *   - arrmsg 패턴 집합은 "닫혀 있지 않다". 야간 관측 2회에서 신규 2건이 나왔으므로
 *     `unknown` 은 예외가 아니라 정상 설계 요소다. KO 는 원문을 그대로 보여주면 안전하다.
 */

/** routes.json 의 routeId → 서울시 실시간 API 의 busRouteId (RT-1 실측 확정) */
export const BUS_ROUTE_ID_BY_ROUTE_ID: Readonly<Record<string, string>> = {
  'saebyeok-a160': '100000024',
  'saebyeok-a741': '100000028',
  'saebyeok-a148': '101000009',
  'simya-a21': '101000005',
  'saebyeok-a504': '101000010',
  'cheonggye-a01': '100000026',
  'dongjak-a01': '101900003',
  'dongdaemun-a01': '100000025',
  'seodaemun-a01': '100000027',
  'sangam-a21': '101000006',
  'cheongwadae-a01': '100000020',
} as const;

/** busRouteId → routeId 역인덱스. 응답 필터링은 이쪽을 쓴다. */
export const ROUTE_ID_BY_BUS_ROUTE_ID: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(BUS_ROUTE_ID_BY_ROUTE_ID).map(([routeId, busRouteId]) => [busRouteId, routeId]),
);

/**
 * arrmsg 상태 종류.
 * `ended` 만 카드에서 제외되고, 나머지는 전부 표시한다.
 * `unknown` 은 미지 패턴을 원문 그대로 흘려보내기 위한 정상 경로다.
 */
export type ArrivalKind = 'imminent' | 'eta' | 'waiting' | 'turning' | 'ended' | 'unknown';

/** 카드에 표시할 정규화 항목. `raw` 가 진실이고 파싱값은 정렬·조판용 부가 정보다. */
export type ArrivalItem = {
  routeId: string;
  busRouteId: string;
  raw: string;
  kind: ArrivalKind;
  /** `N분후` 파싱 성공 시에만 채운다. */
  minutes?: number;
  /** `[K번째 전]` 파싱 성공 시에만 채운다. */
  stopsAway?: number;
};

/** Route Handler 응답 스키마. */
export type ArrivalPayload = {
  stopId: string;
  /** 서버가 upstream 응답을 받은 시각 (epoch ms). 화면의 "HH:MM 기준" 근거. */
  fetchedAt: number;
  items: ArrivalItem[];
};

/**
 * 내부 실패 사유. 사용자에게 노출하지 않는다.
 * APP_BUDGET_EXHAUSTED 는 서울시 장애가 아니라 우리 안전장치가 호출을 막은 것이다.
 */
export type FailureReason =
  | 'AUTH_ERROR'
  | 'UPSTREAM_QUOTA'
  | 'TIMEOUT'
  | 'APP_BUDGET_EXHAUSTED'
  | 'UPSTREAM_ERROR'
  | 'CONFIG_ERROR';

export type ArrivalError = { reason: FailureReason };

const ETA_PATTERN = /^(\d+)분후(?:\[(\d+)번째\s*전\])?/;

/**
 * arrmsg 원문을 분류한다. 원문을 변형하지 않으며, 분류에 실패하면 `unknown` 이다.
 * 미지 패턴을 오류로 취급하지 않는 것이 핵심이다 — 패턴 집합은 아직 닫히지 않았다.
 */
export function classifyArrmsg(raw: string): Pick<ArrivalItem, 'kind' | 'minutes' | 'stopsAway'> {
  const text = raw.trim();
  if (text === '' ) return { kind: 'unknown' };
  if (text === '운행종료') return { kind: 'ended' };
  if (text === '곧 도착') return { kind: 'imminent' };
  if (text === '출발대기') return { kind: 'waiting' };
  if (text === '회차대기') return { kind: 'turning' };

  const eta = ETA_PATTERN.exec(text);
  if (eta) {
    const minutes = Number(eta[1]);
    const stopsAway = eta[2] ? Number(eta[2]) : undefined;
    return { kind: 'eta', minutes, ...(stopsAway === undefined ? {} : { stopsAway }) };
  }
  return { kind: 'unknown' };
}

/** 카드에 넣을 항목인가. `ended` 만 제외한다 (부분 성공 시 나머지는 그대로 표시). */
export function isDisplayable(item: ArrivalItem): boolean {
  return item.kind !== 'ended';
}

const KIND_ORDER: Readonly<Record<ArrivalKind, number>> = {
  imminent: 0,
  eta: 1,
  waiting: 2,
  turning: 3,
  unknown: 4,
  ended: 5, // 표시되지 않으므로 도달하지 않는다
};

/**
 * 정렬: 곧 도착 → N분후 오름차순 → 출발대기 → 회차대기 → 기타.
 * 동순위·파싱 실패는 정적 SSOT 노선 순서로 되돌린다 (렌더마다 순서가 흔들리지 않게).
 */
export function sortArrivals(items: ArrivalItem[], ssotOrder: string[]): ArrivalItem[] {
  const rank = new Map(ssotOrder.map((routeId, index) => [routeId, index]));
  return [...items].sort((a, b) => {
    const byKind = KIND_ORDER[a.kind] - KIND_ORDER[b.kind];
    if (byKind !== 0) return byKind;
    if (a.kind === 'eta' && b.kind === 'eta') {
      const am = a.minutes ?? Number.POSITIVE_INFINITY;
      const bm = b.minutes ?? Number.POSITIVE_INFINITY;
      if (am !== bm) return am - bm;
    }
    return (rank.get(a.routeId) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.routeId) ?? Number.MAX_SAFE_INTEGER);
  });
}
