/**
 * 홈 질문 카드용 클라이언트 모델 (R3A §12 V3). 서버가 만든 압축 문서(/api/night-bus/client · ≈95KB) 를 펼쳐
 * core.mjs 와 같은 계산원으로 탐색한다 — 서버 페이지와 답이 같다. 네트워크 호출은 문서 1회뿐.
 */
import { loadNightBus, resolveQuery, findJourney, countStops, haversine, normName, choOf, isCho } from './core.mjs';

export type CompactStop = [seq: number, arsId: string, nameKo: string, lat: number, lon: number];
export type CompactOfficial = { ends: [string, string]; firstBus: string; lastBus: string; headway: string; vehicles: number; distanceKm: number; asOf: string };
export type CompactRoute = { no: string; color: string | null; official: CompactOfficial; stops: CompactStop[] };
export type CompactHub = { slug: string; nameKo: string; nameEn: string; routes: string[]; ars: string[]; lat: number; lon: number };
export type ClientDoc = { v: string; meta: { stopsSnapshot: string; scheduleRevisedOn: string }; routes: CompactRoute[]; hubs: CompactHub[] };

type Visit = { routeNo: string; idx: number };
type NbStop = { seq: number; arsId: string; nameKo: string; lat: number; lon: number; idx: number; virtual: boolean };
type NbRoute = { no: string; color: string | null; official: CompactOfficial; stops: NbStop[]; ends: [string, string]; turnaround: { index: number }; dirs: { key: string; toward: string; label: string }[] };
type Nb = { routes: NbRoute[]; routeByNo: Map<string, NbRoute>; byName: Map<string, Visit[]>; byArs: Map<string, Visit[]> };

export type ModelHub = { name: string; ars: string[]; slug: string; nameEn: string; routes: string[] };
export type Model = { nb: Nb; doc: ClientDoc; names: string[]; hubs: ModelHub[] };

function isClientDoc(x: unknown): x is ClientDoc {
  const d = x as Partial<ClientDoc> | null;
  return !!d && typeof d === 'object' && Array.isArray(d.routes) && d.routes.length > 0 && Array.isArray(d.hubs) && !!d.meta && typeof d.meta.stopsSnapshot === 'string'
    && d.routes.every((r) => typeof r?.no === 'string' && Array.isArray(r.stops) && !!r.official && typeof r.official.firstBus === 'string');
}

export function buildModel(input: unknown): Model {
  if (!isClientDoc(input)) throw new Error('night-bus client doc: unexpected shape');
  const doc = input;
  const full = {
    routes: doc.routes.map((r) => ({
      no: r.no, id: r.no.toLowerCase(), busRouteId: '', category: 'owl', color: r.color, stopCount: r.stops.length, official: r.official,
      stops: r.stops.map(([seq, arsId, nameKo, lat, lon]) => ({ seq, arsId, nodeId: '', nameKo, lat, lon })),
    })),
  };
  const nb = loadNightBus(full) as unknown as Nb;
  const names = [...new Set(doc.routes.flatMap((r) => r.stops.map((s) => s[2])))].filter((n) => !/[(（]\s*가상/.test(n)).sort((a, b) => a.localeCompare(b, 'ko'));
  const hubs = doc.hubs.map((h) => ({ name: h.nameKo, ars: h.ars, slug: h.slug, nameEn: h.nameEn, routes: h.routes }));
  return { nb, doc, names, hubs };
}

export function routesAtName(model: Model, name: string): string[] {
  return [...new Set((model.nb.byName.get(normName(name)) ?? []).map((v) => v.routeNo))].sort();
}

export type Suggestion = { name: string; kind: 'hub' | 'stop'; routes: string[]; slug?: string; nameEn?: string };
/** 입력 → 추천 목록. 허브 → 이름 앞부분 일치 → 포함 순. 초성 입력 지원. */
export function suggest(model: Model, q: string, limit = 8): Suggestion[] {
  const k = normName(q);
  if (!k) return [];
  const starts = (name: string) => { const nk = normName(name); return isCho(k) ? choOf(nk).startsWith(k) : nk.startsWith(k); };
  const contains = (name: string) => { const nk = normName(name); return isCho(k) ? choOf(nk).includes(k) : nk.includes(k); };
  const latin = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '');
  const kEn = latin(q);
  const startsEn = (nameEn: string) => kEn.length >= 2 && latin(nameEn).split(/station|univ|park|market/).concat(latin(nameEn)).some((w) => w && w.startsWith(kEn));
  const out: Suggestion[] = []; const seen = new Set<string>();
  for (const h of model.hubs) if (starts(h.name) || h.name.split('·').some(starts) || startsEn(h.nameEn)) { out.push({ name: h.name, kind: 'hub', routes: h.routes, slug: h.slug, nameEn: h.nameEn }); seen.add(normName(h.name)); }
  for (const pass of [starts, contains]) {
    for (const n of model.names) {
      if (out.length >= limit) break;
      const nk = normName(n); if (seen.has(nk) || !pass(n)) continue;
      seen.add(nk); out.push({ name: n, kind: 'stop', routes: routesAtName(model, n) });
    }
  }
  return out.slice(0, limit);
}

export function nearestStop(model: Model, lat: number, lon: number): { name: string; arsId: string; dist: number } | null {
  let best: { name: string; arsId: string; dist: number } | null = null;
  for (const r of model.nb.routes) for (const s of r.stops) {
    if (s.virtual) continue;
    const d = haversine({ lat, lon }, s);
    if (!best || d < best.dist) best = { name: s.nameKo, arsId: s.arsId, dist: d };
  }
  return best;
}

export type Leg = { no: string; color: string | null; toward: string; board: { name: string; arsId: string }; alight: { name: string; arsId: string }; stops: number; official: CompactOfficial };
export type Journey =
  | { type: 'unknown'; from: boolean; to: boolean }
  | { type: 'same' }
  | { type: 'none' }
  | { type: 'direct'; legs: [Leg]; stops: number }
  | { type: 'transfer'; legs: [Leg, Leg]; stops: number };

/** 직통 → 물리 그룹 기준 1회 환승 (core.findJourney). 결과는 화면용으로 정규화. */
export function plan(model: Model, fromQ: string, toQ: string): Journey {
  const { nb, hubs } = model;
  const oV = resolveQuery(nb, fromQ, hubs) as Visit[];
  const dV = resolveQuery(nb, toQ, hubs) as Visit[];
  if (!oV.length || !dV.length) return { type: 'unknown', from: !oV.length, to: !dV.length };
  // 같은 곳: 이름이 같거나, 같은 허브의 다른 별칭(종로2가 ↔ 종각)이거나, 해석된 방문 집합이 같을 때
  const hubOf = (q: string) => { const k = normName(q); return hubs.find((h) => normName(h.name) === k || h.name.split('·').some((p) => normName(p) === k)); };
  const key = (v: Visit[]) => v.map((x) => `${x.routeNo}:${x.idx}`).sort().join('|');
  const hf = hubOf(fromQ), ht = hubOf(toQ);
  if (normName(fromQ) === normName(toQ) || (hf && ht && hf.slug === ht.slug) || key(oV) === key(dV)) return { type: 'same' };
  const j = findJourney(nb, oV, dV) as { type: string; routeNo?: string; board?: number; alight?: number; legs?: { routeNo: string; board: number; alight: number }[] };
  const leg = (routeNo: string, board: number, alight: number): Leg => {
    const r = nb.routeByNo.get(routeNo)!; const b = r.stops[board], a = r.stops[alight];
    const d = board < r.turnaround.index ? r.dirs[0] : r.dirs[1];
    return { no: r.no, color: r.color, toward: d.toward, board: { name: b.nameKo, arsId: b.arsId }, alight: { name: a.nameKo, arsId: a.arsId }, stops: countStops(r, board, alight), official: r.official };
  };
  if (j.type === 'direct') { const l = leg(j.routeNo!, j.board!, j.alight!); return { type: 'direct', legs: [l], stops: l.stops }; }
  if (j.type === 'transfer' && j.legs?.length === 2) {
    const a = leg(j.legs[0].routeNo, j.legs[0].board, j.legs[0].alight), b = leg(j.legs[1].routeNo, j.legs[1].board, j.legs[1].alight);
    return { type: 'transfer', legs: [a, b], stops: a.stops + b.stops };
  }
  return { type: 'none' };
}
