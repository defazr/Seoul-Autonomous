/**
 * R3b-1 (2026-10-16) — 정류장 장소 페이지 파생 계산 (서버). 원본(routes.json · night-bus-routes.json)은 읽기만 한다.
 * 관계·순서·이웃·방면은 Graph Core 와 night-bus core 파생 단독이다. 리터럴은 등록부(stop-pages.ts)의 slug·ARS 뿐이다.
 *
 * 방면(D3): 자율주행 = 왕복형 노선의 진행 방향 끝(반환점 전이면 반환점 정류장, 이후면 마지막 정류장 — 정류장 배열 계산 · 순환형은 생략),
 *           올빼미 = core.toward(허브 페이지와 같은 코드 경로). outbound/inbound 어휘는 화면에 내보내지 않는다.
 * 계약 위반(등록 ARS 가 Graph·올빼미 데이터에 없음 / 장소 안 이름 불일치 / 노선당 중복 정차 / 좌표 없음)은
 * 조용한 빈 화면 대신 빌드를 실패시킨다 (Stage 1 page.tsx 의 throw 강도 유지 · 설계 §2.9).
 */
import routesData from '../data/routes.json';
import { buildGraph } from './graph/graph-core.mjs';
import { haversine, toward as owlTowardOf } from './night-bus/core.mjs';
import { getNightBus, routeColor, type NightRoute } from './night-bus/data';
import { nightRoutePath } from './night-bus/registry';
import { getRouteById } from './routes';
import { getOfficialStopNameEn } from './stops';
import { STOP_PLACES, type StopPlace } from './stop-pages';
import type { FixedRoute } from './types/route';

const graph = buildGraph(routesData);
const NEARBY_M = 300;

export type AutoVisit = {
  routeId: string;
  route: FixedRoute;
  seq: number;
  total: number;
  /** 진행 방향 끝 (null = 순환형) */
  towardKo: string | null;
  towardEn: string | null;
  prev: { stopId: string; nameKo: string } | null;
  next: { stopId: string; nameKo: string } | null;
};
export type OwlVisit = { no: string; towardKo: string; color: string; path?: string };
export type Platform = { ars: string; nameKo: string; lat: number; lon: number; auto: AutoVisit[]; owl: OwlVisit[] };
/** 한쪽 플랫폼에만 서는 노선 — 반대 방향의 가장 가까운 정류소(300m 안이면) */
export type Asymmetry = { kind: 'auto' | 'owl'; label: string; onlyAt: string; otherArs: string; opposite: { ars: string; nameKo: string; distanceM: number } | null };
export type NearbyStop = { ars: string; nameKo: string; distanceM: number; owl: string[] };
export type PlaceView = { place: StopPlace; platforms: Platform[]; distanceM: number; asymmetries: Asymmetry[]; nearby: NearbyStop[]; routeIds: string[]; lastChecked: string };

function owlNos(): Set<string> {
  return new Set(getNightBus().routes.filter((r) => r.category === 'owl').map((r) => r.no));
}

/** ARS 의 좌표 — 같은 번호의 올빼미 정류소(OA-1095) 좌표. routes.json 에는 좌표가 없다. */
function coordOf(ars: string): { lat: number; lon: number } | null {
  const nb = getNightBus();
  const v = nb.byArs.get(ars)?.[0];
  if (!v) return null;
  const s = nb.routeByNo.get(v.routeNo)!.stops[v.idx];
  return { lat: s.lat, lon: s.lon };
}

/**
 * 진행 방향 끝 = 실제 정류장 배열로 계산 (잠금: "반환점·마지막 정류장은 실제 stop 배열로 계산" · startPoint/endPoint 필드 미사용).
 * 반환점 전 = 반환점(isTurnaround) 정류장 · 반환점 이후 = 노선 마지막 정류장 · 순환형 = 생략. EN 은 공식명 단독(미스는 한국어).
 */
function autoToward(gr: { visits: { seq: number; stopId: string; nameKo: string }[]; turnaroundSeq: number }, visit: { seq: number; direction: string }): { ko: string; en: string } | null {
  if (visit.direction === 'loop') return null;
  const end = visit.direction === 'outbound' && visit.seq < gr.turnaroundSeq
    ? gr.visits.find((v) => v.seq === gr.turnaroundSeq)!
    : gr.visits[gr.visits.length - 1];
  return { ko: end.nameKo, en: getOfficialStopNameEn(end.stopId) ?? end.nameKo };
}

function buildPlatform(ars: string, placeName: string): Platform {
  const stop = graph.stopsById.get(ars);
  if (!stop) throw new Error(`Stop place platform ${ars} is not present in the transit graph`);
  if (stop.nameKo !== placeName) throw new Error(`Stop place platform ${ars} is named ${stop.nameKo}, not ${placeName}`);
  const routeIds = new Set(stop.visits.map((v) => v.routeId));
  if (routeIds.size !== stop.visits.length) throw new Error(`Stop place platform ${ars} is visited more than once by the same route`);
  const c = coordOf(ars);
  if (!c) throw new Error(`Stop place platform ${ars} has no coordinates (not in night-bus stop data)`);

  const auto: AutoVisit[] = stop.visits.map((v) => {
    const route = getRouteById(v.routeId);
    const gr = graph.routes.find((r) => r.routeId === v.routeId);
    if (!route || !gr) throw new Error(`Stop place platform ${ars} references unknown route ${v.routeId}`);
    const tw = autoToward(gr, v);
    return {
      routeId: v.routeId, route, seq: v.seq, total: gr.visits.length,
      towardKo: tw?.ko ?? null, towardEn: tw?.en ?? null,
      prev: v.prev ? { stopId: v.prev.stopId, nameKo: v.prev.nameKo } : null,
      next: v.next ? { stopId: v.next.stopId, nameKo: v.next.nameKo } : null,
    };
  });

  const nb = getNightBus();
  const owlSet = owlNos();
  const owl: OwlVisit[] = (nb.byArs.get(ars) ?? [])
    .filter((v) => owlSet.has(v.routeNo))
    .map((v) => {
      const r = nb.routeByNo.get(v.routeNo)! as NightRoute;
      return { no: r.no, towardKo: owlTowardOf(r, v.idx) as string, color: routeColor(r), path: nightRoutePath(r.no) };
    })
    .sort((a, b) => a.no.localeCompare(b.no));
  return { ars, nameKo: stop.nameKo, lat: c.lat, lon: c.lon, auto, owl };
}

/** 한 플랫폼에만 서는 자율주행·올빼미 노선과, 그 노선이 반대 방향에서 서는 가장 가까운 정류소. */
function asymmetriesOf(platforms: Platform[]): Asymmetry[] {
  const out: Asymmetry[] = [];
  const nb = getNightBus();
  for (const p of platforms) {
    for (const q of platforms) {
      if (p === q) continue;
      const qc = { lat: q.lat, lon: q.lon };
      for (const a of p.auto) {
        if (q.auto.some((x) => x.routeId === a.routeId)) continue;
        const gr = graph.routes.find((r) => r.routeId === a.routeId)!;
        const dirP = gr.visits.find((v) => v.seq === a.seq)!.direction;
        const opp = gr.visits
          .filter((v) => v.direction !== dirP && v.direction !== 'loop')
          .map((v) => ({ v, c: coordOf(v.stopId) }))
          .filter((x): x is { v: typeof x.v; c: { lat: number; lon: number } } => x.c !== null)
          .map((x) => ({ ars: x.v.stopId, nameKo: x.v.nameKo, distanceM: haversine(x.c, qc) }))
          .sort((x, y) => x.distanceM - y.distanceM)[0];
        out.push({ kind: 'auto', label: a.routeId, onlyAt: p.ars, otherArs: q.ars, opposite: opp && opp.distanceM <= NEARBY_M ? opp : null });
      }
      for (const o of p.owl) {
        if (q.owl.some((x) => x.no === o.no)) continue;
        const r = nb.routeByNo.get(o.no)! as NightRoute;
        const vP = nb.byArs.get(p.ars)!.find((v) => v.routeNo === o.no)!;
        const side = (idx: number) => (idx < r.turnaround.index ? 0 : 1);
        const opp = r.stops
          .filter((s) => !s.virtual && side(s.idx) !== side(vP.idx))
          .map((s) => ({ ars: s.arsId, nameKo: s.nameKo, distanceM: haversine(s, qc) }))
          .sort((x, y) => x.distanceM - y.distanceM)[0];
        out.push({ kind: 'owl', label: o.no, onlyAt: p.ars, otherArs: q.ars, opposite: opp && opp.distanceM <= NEARBY_M ? opp : null });
      }
    }
  }
  return out;
}

/** 플랫폼에서 직선 300m 안의 다른 올빼미버스 정류소 (플랫폼 자신 제외 · 가까운 순). */
function nearbyOf(platforms: Platform[]): NearbyStop[] {
  const nb = getNightBus();
  const owlSet = owlNos();
  const own = new Set(platforms.map((p) => p.ars));
  const found = new Map<string, NearbyStop>();
  for (const r of nb.routes) {
    if (!owlSet.has(r.no)) continue;
    for (const s of r.stops) {
      if (s.virtual || own.has(s.arsId)) continue;
      const d = Math.min(...platforms.map((p) => haversine(s, p)));
      if (d > NEARBY_M) continue;
      const e = found.get(s.arsId) ?? { ars: s.arsId, nameKo: s.nameKo, distanceM: d, owl: [] };
      if (!e.owl.includes(r.no)) e.owl.push(r.no);
      e.distanceM = Math.min(e.distanceM, d);
      found.set(s.arsId, e);
    }
  }
  return [...found.values()].map((e) => ({ ...e, owl: e.owl.sort() })).sort((a, b) => a.distanceM - b.distanceM);
}

export function buildPlaceView(place: StopPlace): PlaceView {
  if (place.platforms.length !== 2) throw new Error(`Stop place ${place.slug} must have exactly 2 platforms`);
  const platforms = place.platforms.map((ars) => buildPlatform(ars, place.nameKo));
  const [a, b] = platforms;
  const routeIds = [...new Set(platforms.flatMap((p) => p.auto.map((x) => x.routeId)))];
  // 장소 lastmod = 두 플랫폼 노선 합집합의 확인일 최대 (비대칭 노선 누락 방지 · Codex FIX 5)
  const lastChecked = routeIds.map((id) => getRouteById(id)!.lastChecked).reduce((m, d) => (d > m ? d : m), '');
  return { place, platforms, distanceM: haversine(a, b), asymmetries: asymmetriesOf(platforms), nearby: nearbyOf(platforms), routeIds, lastChecked };
}

/** 표시용 거리 — 10m 단위 반올림. */
export const roundM = (m: number) => Math.max(10, Math.round(m / 10) * 10);

/** 영문 표시명(공식 SSoT 단독 · 미스는 한국어). */
export const stopNameEn = (ars: string, nameKo: string) => getOfficialStopNameEn(ars) ?? nameKo;

/** 등록부 불변식 — sitemap·페이지 공통 (빌드 실패 조건 · 설계 §2.9). */
export function assertStopPlaces(): void {
  const seen = new Set<string>();
  const slugs = new Set<string>();
  for (const place of STOP_PLACES) {
    // slug 가 겹치거나 형식이 틀리면 정적 경로·sitemap·bySlug 가 조용히 충돌한다 (Codex 검수 10-16)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(place.slug)) throw new Error(`Stop place slug "${place.slug}" is not lower-case kebab-case`);
    if (slugs.has(place.slug)) throw new Error(`Stop place slug "${place.slug}" is registered twice`);
    slugs.add(place.slug);
    if (place.platforms.length === 0) throw new Error(`Stop place ${place.slug} has no platforms`);
    for (const ars of place.platforms) {
      if (!/^\d{5}$/.test(ars)) throw new Error(`ARS "${ars}" in ${place.slug} is not a 5-digit stop number`);
      if (seen.has(ars)) throw new Error(`ARS ${ars} is registered in more than one stop place`);
      seen.add(ars);
    }
    buildPlaceView(place);
  }
}
