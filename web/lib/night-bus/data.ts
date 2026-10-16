/**
 * R3a — N버스 서버측 데이터 접근 (SSoT JSON + core.mjs). 앱 코드는 이 모듈만 통해 접근한다.
 * 원본 파일은 수정하지 않는다: night-bus-routes.json · night-bus-hubs.json · night-bus-schematic-anchors.json
 */
import routesDoc from '../../data/night-bus-routes.json';
import hubsDoc from '../../data/night-bus-hubs.json';
import anchorsDoc from '../../data/night-bus-schematic-anchors.json';
import { loadNightBus } from './core.mjs';

export type NightStop = { seq: number; arsId: string; nodeId: string; nameKo: string; lat: number; lon: number; idx: number; virtual: boolean };
export type NightDir = { key: 'out' | 'in'; toward: string; label: string; stops: NightStop[] };
export type NightOfficial = { ends: [string, string]; vehicles: number; distanceKm: number; headway: string; firstBus: string; lastBus: string; source: string; asOf: string };
export type NightRoute = {
  no: string; id: string; busRouteId: string; category: 'owl' | 'airport-night'; color: string | null; stopCount: number;
  official?: NightOfficial; stops: NightStop[]; ends: [string, string];
  turnaround: { index: number; seq: number; symmetry: number; reliable: boolean }; dirs: NightDir[];
};
export type Hub = { slug: string; nameKo: string; nameEn: string; routes: string[]; ars: string[]; groups: string[]; lat: number; lon: number };
export type Anchor = { node: string; idx: number; seq: number; arsId: string; nameKo: string };
type NightBus = { routes: NightRoute[]; routeByNo: Map<string, NightRoute>; byName: Map<string, { routeNo: string; idx: number }[]>; byArs: Map<string, { routeNo: string; idx: number }[]> };

let cache: NightBus | null = null;
export function getNightBus(): NightBus {
  if (!cache) cache = loadNightBus(routesDoc as unknown as Parameters<typeof loadNightBus>[0]) as unknown as NightBus;
  return cache;
}
export function getNightRoute(no: string): NightRoute | undefined { return getNightBus().routeByNo.get(no.toUpperCase()); }
export const HUBS: Hub[] = (hubsDoc as { hubs: Hub[] }).hubs;
export const ANCHORS = (anchorsDoc as { anchors: Record<string, Record<'out' | 'in', Anchor[]>> }).anchors;
export const NIGHT_META = (routesDoc as { _meta: { stopsSource: { dataset: string; url: string; snapshot: string; license: string }; scheduleSource: { title: string; url: string; publisher: string; revisedOn: string } } })._meta;
/** 다크 바탕에서 보이지 않는 공식색의 표시 대체 (SSoT 값은 보존). */
export const DISPLAY_COLOR: Record<string, string> = { N72: '#C9CFDA' };
export function routeColor(r: { no: string; color: string | null }): string { return DISPLAY_COLOR[r.no] ?? r.color ?? '#9AA3B2'; }
export function hubsForRoute(no: string): Hub[] { return HUBS.filter((h) => h.routes.includes(no)); }
/** 정류장 이름(정규화)으로 만나는 올빼미 노선 집합. */
export function routesAtName(nameKo: string, exceptNo?: string): string[] {
  const nb = getNightBus();
  const norm = nameKo.replace(/[(（]\s*가상[^)）]*[)）]/g, '').replace(/\s+/g, '').replace(/[().·,]/g, '');
  const set = new Set<string>();
  for (const v of nb.byName.get(norm) ?? []) if (v.routeNo !== exceptNo) set.add(v.routeNo);
  return [...set].sort();
}
