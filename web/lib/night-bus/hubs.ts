/**
 * R3a-E — 허브 페이지용 파생 계산 (서버). hubs.json 등록부 + core 로더.
 */
import { getNightBus, getNightRoute, HUBS, routeColor, type Hub, type NightRoute } from './data';
import { haversine } from './core.mjs';

export type Platform = { arsId: string; name: string; lat: number; lon: number; lines: { no: string; toward: string; label: string }[] };
export function getHub(slug: string): Hub | undefined { return HUBS.find((h) => h.slug === slug); }
function labelFor(route: NightRoute, idx: number) { return idx < route.turnaround.index ? route.dirs[0] : route.dirs[1]; }

/** 정류소(ARS)별 정차 노선과 방면. 같은 ARS 를 같은 노선이 두 번 지나면 둘 다 적는다. */
export function hubPlatforms(hub: Hub): Platform[] {
  const nb = getNightBus(); const out: Platform[] = [];
  for (const ars of hub.ars) {
    const visits = nb.byArs.get(ars) ?? []; if (!visits.length) continue;
    const first = nb.routeByNo.get(visits[0].routeNo)!.stops[visits[0].idx];
    const lines = visits.filter((v) => hub.routes.includes(v.routeNo)).map((v) => { const r = nb.routeByNo.get(v.routeNo)!; const d = labelFor(r, v.idx); return { no: r.no, toward: d.toward, label: d.label }; });
    lines.sort((a, b) => a.no.localeCompare(b.no));
    out.push({ arsId: ars, name: first.nameKo, lat: first.lat, lon: first.lon, lines });
  }
  return out;
}

/** 실제 지도(MapLibre)용 데이터: 허브 노선 전체 경로(가상 제외 · lon/lat) + 반경 안 정류장 점. */
export function hubGeoJson(hub: Hub, radiusM = 2500) {
  const nb = getNightBus();
  const lines = hub.routes.map((no) => { const r = nb.routeByNo.get(no)!; return { no, color: routeColor(r), coords: r.stops.filter((s) => !s.virtual).map((s) => [s.lon, s.lat] as [number, number]) }; });
  const seen = new Set<string>(hub.ars); const nearby: { arsId: string; name: string; lon: number; lat: number }[] = [];
  for (const no of hub.routes) for (const s of nb.routeByNo.get(no)!.stops) { if (s.virtual || seen.has(s.arsId) || haversine(s, hub) > radiusM) continue; seen.add(s.arsId); nearby.push({ arsId: s.arsId, name: s.nameKo, lon: s.lon, lat: s.lat }); }
  return { lines, nearby };
}

export function relatedHubs(hub: Hub): Hub[] { return HUBS.filter((h) => h.slug !== hub.slug && h.routes.some((r) => hub.routes.includes(r))).sort((a, b) => b.routes.filter((r) => hub.routes.includes(r)).length - a.routes.filter((r) => hub.routes.includes(r)).length); }
export function routesOf(hub: Hub): NightRoute[] { return hub.routes.map((no) => getNightRoute(no)!).filter(Boolean); }
