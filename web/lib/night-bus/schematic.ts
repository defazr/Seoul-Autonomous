/**
 * R3a — 포그린 CorelDRAW 노선도(night-bus-data.ts · 읽기 전용)를 계산에 쓰는 파생 함수.
 * 작도 좌표는 보정하지 않는다. "점이 없는 정류장" 은 앞뒤 앵커(주요 역) 사이를 정류장 순서 비율로 보간한다 — 개략 위치.
 */
import { NODES, ROUTE_POLY, ROUTE_COLORS, ROUTE_ORDER, RIVER } from '../../app/[locale]/night-bus-map/night-bus-data';
import type { Anchor, NightStop } from './data';

export const SCHEMATIC_VB = { x: -70, y: -65, w: 2560, h: 1600 };
export { ROUTE_COLORS, ROUTE_ORDER, RIVER, NODES };

export function routePathD(no: string): string {
  const pts = ROUTE_POLY[no] || [];
  return pts.length < 2 ? '' : 'M ' + pts.map((p) => `${p[0]} ${p[1]}`).join(' L ');
}
export function allRouteLines(): { no: string; d: string; color: string }[] {
  return ROUTE_ORDER.filter((no) => ROUTE_POLY[no]).map((no) => ({ no, d: routePathD(no), color: ROUTE_COLORS[no] }));
}
function cum(pts: [number, number][]): number[] { const c = [0]; for (let i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return c; }
function pointAt(pts: [number, number][], c: number[], t: number): [number, number] {
  if (t <= 0) return pts[0]; if (t >= c[c.length - 1]) return pts[pts.length - 1];
  let i = 1; while (c[i] < t) i++; const a = pts[i - 1], b = pts[i], f = (t - c[i - 1]) / (c[i] - c[i - 1] || 1);
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
}
function nearestT(pts: [number, number][], c: number[], p: [number, number]): number { let best = 0, bd = Infinity; pts.forEach((q, i) => { const d = (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2; if (d < bd) { bd = d; best = i; } }); return c[best]; }

export type MapTick = { idx: number; x: number; y: number; name: string; arsId: string; turn: boolean };
export type MapAnchor = { node: string; x: number; y: number; idx: number };
/** 방면 정류장 목록(가상 제외)을 노선도 위에 배치. anchors 는 build-night-bus-derived.mjs 산출. */
export function placeStopsOnMap(no: string, dirStops: NightStop[], anchors: Anchor[], turnIndex: number): { ticks: MapTick[]; anchorsOnMap: MapAnchor[]; outside: number } {
  const pts = ROUTE_POLY[no]; if (!pts || pts.length < 2) return { ticks: [], anchorsOnMap: [], outside: dirStops.length };
  const c = cum(pts); const pos = new Map(dirStops.map((s, i) => [s.idx, i]));
  const A = anchors.filter((a) => pos.has(a.idx) && NODES[a.node]).map((a) => ({ node: a.node, idx: a.idx, i: pos.get(a.idx)!, t: nearestT(pts, c, NODES[a.node]) })).sort((x, y) => x.i - y.i);
  const ticks: MapTick[] = [];
  for (let k = 0; k < A.length - 1; k++) { const a = A[k], b = A[k + 1]; for (let i = a.i + 1; i < b.i; i++) { const [x, y] = pointAt(pts, c, a.t + (b.t - a.t) * (i - a.i) / (b.i - a.i)); const s = dirStops[i]; ticks.push({ idx: s.idx, x: +x.toFixed(1), y: +y.toFixed(1), name: s.nameKo, arsId: s.arsId, turn: s.idx === turnIndex }); } }
  const outside = A.length ? A[0].i + (dirStops.length - 1 - A[A.length - 1].i) : dirStops.length;
  return { ticks, anchorsOnMap: A.map((a) => { const [x, y] = NODES[a.node]; return { node: a.node, x, y, idx: a.idx }; }), outside };
}
export function routeBBox(no: string, pad = 140): { x: number; y: number; w: number; h: number } {
  const pts = ROUTE_POLY[no]; if (!pts) return SCHEMATIC_VB;
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad, w = Math.max(...xs) - Math.min(...xs) + pad * 2, h = Math.max(...ys) - Math.min(...ys) + pad * 2;
  return { x: x0, y: y0, w: Math.max(w, h * 1.6), h: Math.max(h, w / 1.6) };
}
export const shortName = (n: string) => (n === '서울역' ? n : n.replace(/역$/, ''));
