/**
 * Phase 1A Graph Core — Route → StopVisit → Stop 3층 파생 계산.
 *
 * 계약 (docs/worklogs/PHASE0-CTG-STRUCTURE-AUDIT-20260825.md §J, §K):
 *   - 유일한 입력은 web/data/routes.json 을 파싱한 객체다. 이 모듈은 파일을 읽지 않고,
 *     JSON 을 import 하지 않으며, CLI 출력을 하지 않고, 기대 매트릭스의 수치를 알지 않는다.
 *   - 원본 객체를 mutate 하지 않는다. 파생 결과만 새로 만든다.
 *   - prev/next/direction 은 StopVisit(routeId, seq) 층에서 계산한다. 같은 노선이 같은
 *     stopId 를 두 번 지나는 실데이터(순환 폐합)가 있어 stopId 만으로는 순서를 식별할 수 없다.
 *   - 노선 간 공유(routeIds)는 Stop(stopId) 층에서 set semantics 로 계산한다.
 *     같은 노선의 반복 occurrence 가 membership 을 부풀리면 안 된다.
 *   - 구조 위반 입력은 빈 결과로 계속 진행하지 않고 GraphInputError 로 즉시 실패시킨다.
 *
 * validator(web/scripts/validate-graph.mjs)와 이후 앱 consumer 는 이 모듈 하나를 공유한다.
 */

/**
 * @typedef {Object} RawStop
 * @property {number} seq            1-base 연속 순번 (route 내에서 index + 1 과 일치해야 한다)
 * @property {string} nameKo
 * @property {string|null} nameEn    legacy 필드 — 표시 계약상 사용하지 않는다 (C2E.1)
 * @property {string} stopId         5자리 ARS 문자열
 * @property {boolean} isTurnaround  route 당 정확히 1개
 */

/**
 * @typedef {Object} StopVisit
 * @property {string} routeId
 * @property {number} seq
 * @property {string} stopId
 * @property {string} nameKo
 * @property {boolean} isTurnaround
 * @property {'outbound'|'inbound'|'loop'} direction
 * @property {StopVisit|null} prev   같은 route 의 인접 occurrence (stopId 문자열이 아니라 참조)
 * @property {StopVisit|null} next
 */

/**
 * @typedef {Object} GraphRoute
 * @property {string} routeId
 * @property {'roundTrip'|'loop'} shape
 * @property {number} turnaroundSeq
 * @property {StopVisit[]} visits    원본 stops 순서 그대로의 occurrence 목록
 */

/**
 * @typedef {Object} GraphStop
 * @property {string} stopId                 원자 identity (ARS)
 * @property {string} nameKo
 * @property {string|null} nameEn            공식 영문명 (lookup 미존재 시 null — 호출부가 nameKo 로 대체)
 * @property {string[]} nameKoConflicts      같은 stopId 에 다른 nameKo 가 나타난 경우의 이형 목록 (정상 데이터에선 빈 배열)
 * @property {Set<string>} routeIds          이 정류장을 지나는 노선 집합 (occurrence dedup)
 * @property {StopVisit[]} visits            이 정류장의 모든 occurrence
 */

/**
 * @typedef {Object} TransitGraph
 * @property {GraphRoute[]} routes
 * @property {StopVisit[]} visits            전 노선 occurrence 평탄 목록
 * @property {Map<string, GraphStop>} stopsById
 */

export const ROUTE_SHAPE = Object.freeze({
  ROUND_TRIP: 'roundTrip',
  LOOP: 'loop',
});

export const DIRECTION = Object.freeze({
  OUTBOUND: 'outbound',
  INBOUND: 'inbound',
  LOOP: 'loop',
});

const STOP_ID_PATTERN = /^\d{5}$/;

export class GraphInputError extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = 'GraphInputError';
  }
}

/** @param {string} message @returns {never} */
function fail(message) {
  throw new GraphInputError(message);
}

/**
 * 입력 구조 게이트. 위반은 즉시 GraphInputError.
 * lib/routes.ts 의 `as FixedRoute[]` 단언이 숨길 수 있는 구조 오류를 여기서 독립 검증한다.
 *
 * @param {unknown} routesJson  web/data/routes.json 을 파싱한 루트 객체
 * @returns {Array<{id: string, stops: RawStop[]}>}
 */
function assertInput(routesJson) {
  if (typeof routesJson !== 'object' || routesJson === null) {
    fail('routes.json root must be an object');
  }
  const fixedRoutes = /** @type {{fixedRoutes?: unknown}} */ (routesJson).fixedRoutes;
  if (!Array.isArray(fixedRoutes)) fail('fixedRoutes must be an array');
  if (fixedRoutes.length === 0) fail('fixedRoutes must not be empty');

  const seenRouteIds = new Set();
  for (const [routeIndex, route] of fixedRoutes.entries()) {
    if (typeof route !== 'object' || route === null) {
      fail(`fixedRoutes[${routeIndex}] must be an object`);
    }
    const { id, stops } = /** @type {{id?: unknown, stops?: unknown}} */ (route);
    if (typeof id !== 'string' || id.length === 0) {
      fail(`fixedRoutes[${routeIndex}].id must be a non-empty string`);
    }
    if (seenRouteIds.has(id)) fail(`duplicate route id: ${id}`);
    seenRouteIds.add(id);

    // FixedRoute.stops 는 타입상 optional 이지만 graph 에서는 하드 실패 계약이다
    // (route page 의 빈 stops throw 와 동일 강도).
    if (!Array.isArray(stops)) fail(`route ${id}: stops must be an array`);
    if (stops.length === 0) fail(`route ${id}: stops must not be empty`);

    let turnaroundCount = 0;
    for (const [stopIndex, stop] of stops.entries()) {
      const where = `route ${id} stops[${stopIndex}]`;
      if (typeof stop !== 'object' || stop === null) fail(`${where} must be an object`);
      const s = /** @type {Partial<RawStop>} */ (stop);
      if (!Number.isInteger(s.seq)) fail(`${where}.seq must be an integer`);
      if (s.seq !== stopIndex + 1) {
        fail(`${where}.seq must equal index + 1 (expected ${stopIndex + 1}, got ${s.seq})`);
      }
      if (typeof s.stopId !== 'string' || s.stopId.length === 0) {
        fail(`${where}.stopId must be a non-empty string`);
      }
      if (!STOP_ID_PATTERN.test(s.stopId)) {
        fail(`${where}.stopId must be a 5-digit string (got "${s.stopId}")`);
      }
      if (typeof s.nameKo !== 'string' || s.nameKo.trim().length === 0) {
        fail(`${where}.nameKo must be a non-blank string`);
      }
      if (typeof s.isTurnaround !== 'boolean') fail(`${where}.isTurnaround must be a boolean`);
      if (s.isTurnaround) turnaroundCount += 1;
    }
    if (turnaroundCount !== 1) {
      fail(`route ${id}: expected exactly 1 turnaround stop, found ${turnaroundCount}`);
    }
  }
  return /** @type {Array<{id: string, stops: RawStop[]}>} */ (fixedRoutes);
}

/**
 * routes.json 루트 객체에서 3층 그래프를 파생한다.
 *
 * @param {unknown} routesJson
 * @param {Map<string, string|null>} [officialEnByStopId]
 *   stopId → 공식 영문명 lookup. 정본은 web/data/stops/stop-names.json 이며 caller 가 읽어
 *   전달한다 (core 는 파일을 읽지 않는다). 미전달·미존재 stopId 는 nameEn null 로 파생되고,
 *   표시 fallback(nameKo)은 기존 계약대로 호출부 책임이다. 새 영문명을 만들지 않는다.
 * @returns {TransitGraph}
 */
export function buildGraph(routesJson, officialEnByStopId = new Map()) {
  const fixedRoutes = assertInput(routesJson);

  /** @type {GraphRoute[]} */
  const routes = [];
  /** @type {StopVisit[]} */
  const visits = [];
  /** @type {Map<string, GraphStop>} */
  const stopsById = new Map();

  for (const rawRoute of fixedRoutes) {
    const rawStops = rawRoute.stops;
    const first = rawStops[0];
    const last = rawStops[rawStops.length - 1];
    // 순환형 판정: 첫 stopId === 마지막 stopId (현행 데이터의 폐합 occurrence 명시 방식).
    const shape = first.stopId === last.stopId ? ROUTE_SHAPE.LOOP : ROUTE_SHAPE.ROUND_TRIP;
    const turnaroundSeq = rawStops.find((stop) => stop.isTurnaround).seq;

    /** @type {StopVisit[]} */
    const routeVisits = rawStops.map((stop) => ({
      routeId: rawRoute.id,
      seq: stop.seq,
      stopId: stop.stopId,
      nameKo: stop.nameKo,
      isTurnaround: stop.isTurnaround,
      // 방향은 왕복형 전용: 반환점 occurrence 까지(포함)가 outbound, 이후가 inbound.
      // 순환형에는 outbound/inbound 를 부여하지 않는다.
      direction:
        shape === ROUTE_SHAPE.LOOP
          ? DIRECTION.LOOP
          : stop.seq <= turnaroundSeq
            ? DIRECTION.OUTBOUND
            : DIRECTION.INBOUND,
      prev: null,
      next: null,
    }));

    // prev/next 는 occurrence 참조다. loop 라도 마지막 next 를 첫 occurrence 로 잇지 않는다 —
    // 원본이 폐합 occurrence(첫=마지막 stopId)를 별도 방문으로 명시하므로 raw 순서를 보존한다.
    for (const [i, visit] of routeVisits.entries()) {
      visit.prev = i > 0 ? routeVisits[i - 1] : null;
      visit.next = i < routeVisits.length - 1 ? routeVisits[i + 1] : null;
    }

    routes.push({ routeId: rawRoute.id, shape, turnaroundSeq, visits: routeVisits });
    visits.push(...routeVisits);

    for (const visit of routeVisits) {
      let stop = stopsById.get(visit.stopId);
      if (!stop) {
        stop = {
          stopId: visit.stopId,
          nameKo: visit.nameKo,
          nameEn: officialEnByStopId.get(visit.stopId) ?? null,
          nameKoConflicts: [],
          routeIds: new Set(),
          visits: [],
        };
        stopsById.set(visit.stopId, stop);
      } else if (stop.nameKo !== visit.nameKo && !stop.nameKoConflicts.includes(visit.nameKo)) {
        stop.nameKoConflicts.push(visit.nameKo);
      }
      stop.routeIds.add(visit.routeId);
      stop.visits.push(visit);
    }
  }

  return { routes, visits, stopsById };
}

/**
 * 같은 route 안에서 stopId 가 2회 이상 나타나는 occurrence 집계 (순환 폐합 검출).
 * @param {TransitGraph} graph
 * @returns {Array<{routeId: string, stopId: string, visits: StopVisit[]}>}
 */
export function findWithinRouteDuplicates(graph) {
  const duplicates = [];
  for (const route of graph.routes) {
    /** @type {Map<string, StopVisit[]>} */
    const byStopId = new Map();
    for (const visit of route.visits) {
      const bucket = byStopId.get(visit.stopId);
      if (bucket) bucket.push(visit);
      else byStopId.set(visit.stopId, [visit]);
    }
    for (const [stopId, stopVisits] of byStopId) {
      if (stopVisits.length > 1) {
        duplicates.push({ routeId: route.routeId, stopId, visits: stopVisits });
      }
    }
  }
  return duplicates;
}

/**
 * 2개 이상 노선이 공유하는 Stop 목록 (노선 간 환승 엣지 후보).
 * @param {TransitGraph} graph
 * @returns {GraphStop[]}
 */
export function findMultiRouteStops(graph) {
  return [...graph.stopsById.values()].filter((stop) => stop.routeIds.size > 1);
}

/**
 * 동일 nameKo 가 서로 다른 stopId 정확히 2개로 존재하는 방향쌍 관계.
 * sameRoute 는 두 stopId 의 노선 집합 교집합이 비어 있지 않다는 뜻이다
 * (Phase 0 의미: 같은 노선의 왕복 방향쌍).
 *
 * @param {TransitGraph} graph
 * @returns {{pairs: Array<{nameKo: string, stopIds: [string, string], sameRoute: boolean}>, namesWithThreePlusStopIds: string[]}}
 */
export function findSameNamePairs(graph) {
  /** @type {Map<string, Set<string>>} */
  const stopIdsByName = new Map();
  for (const stop of graph.stopsById.values()) {
    const ids = stopIdsByName.get(stop.nameKo);
    if (ids) ids.add(stop.stopId);
    else stopIdsByName.set(stop.nameKo, new Set([stop.stopId]));
  }

  /** @type {Array<{nameKo: string, stopIds: [string, string], sameRoute: boolean}>} */
  const pairs = [];
  /** @type {string[]} */
  const namesWithThreePlusStopIds = [];
  for (const [nameKo, idSet] of stopIdsByName) {
    if (idSet.size === 2) {
      const [a, b] = [...idSet].sort();
      const routesA = graph.stopsById.get(a).routeIds;
      const routesB = graph.stopsById.get(b).routeIds;
      const sameRoute = [...routesA].some((routeId) => routesB.has(routeId));
      pairs.push({ nameKo, stopIds: [a, b], sameRoute });
    } else if (idSet.size > 2) {
      namesWithThreePlusStopIds.push(nameKo);
    }
  }
  return { pairs, namesWithThreePlusStopIds };
}
