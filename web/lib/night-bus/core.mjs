/**
 * N버스(올빼미버스) 파생 계산 — 단일 source (validator · 빌드 스크립트 · 앱 공용).
 * 입력은 web/data/night-bus-routes.json (원본 무가공 사본). 이 모듈은 입력을 변형하지 않는다.
 *
 * 제공: 로더(방면 분할·반환점) · 물리 그룹(같은 이름·400m) · 질의 해석(초성 포함) · 경로 탐색(직통 → 그룹 기준 1회 환승) · 운행 시간대 판정.
 * 금지: 네트워크 · 파일 쓰기 · DOM. 순수 함수만.
 */

export const VIRTUAL = /[(（]\s*가상/;
const CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
export const normName = (s) => String(s).replace(/[(（]\s*가상[^)）]*[)）]/g, '').replace(/\s+/g, '').replace(/[().·,]/g, '');
export const choOf = (s) => [...s].map((ch) => { const c = ch.charCodeAt(0) - 0xac00; return c >= 0 && c < 11172 ? CHO[Math.floor(c / 588)] : ch; }).join('');
export const isCho = (s) => /^[ㄱ-ㅎ]+$/.test(s);
export function haversine(a, b) { const R = 6371000, r = (d) => (d * Math.PI) / 180; const dLat = r(b.lat - a.lat), dLon = r(b.lon - a.lon); const s = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLon / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(s)); }
export const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

/** 반환점 = 전후 정류장 열이 거울처럼 맞는 지점. 대칭 0.15 미만은 자동 추정 불가(UI 는 공식 기·종점 이름만 쓴다). */
export function computeTurnaround(stops) {
  const same = (a, b) => normName(a.nameKo) === normName(b.nameKo) || haversine(a, b) <= 200;
  let best = -1, at = 0;
  for (let i = 1; i < stops.length - 1; i++) { let score = 0; for (let j = 1; i - j >= 0 && i + j < stops.length; j++) if (same(stops[i - j], stops[i + j])) score++; if (score > best) { best = score; at = i; } }
  const half = Math.max(1, Math.min(at, stops.length - 1 - at));
  const symmetry = +(Math.max(0, best) / half).toFixed(2);
  return { index: at, seq: stops[at]?.seq ?? 1, symmetry, reliable: symmetry >= 0.15 };
}

/** SSoT → 계산용 모델. */
export function loadNightBus(doc) {
  const routes = doc.routes.map((r) => {
    const stops = r.stops.map((s, idx) => ({ ...s, idx, virtual: VIRTUAL.test(s.nameKo) }));
    const turn = computeTurnaround(stops);
    const ends = r.official?.ends ?? [stops[0].nameKo, stops[turn.index].nameKo];
    const dirs = [
      { key: 'out', toward: ends[1], label: `${ends[1]} 방면`, stops: stops.filter((s) => s.idx < turn.index) },
      { key: 'in', toward: ends[0], label: `${ends[0]} 방면`, stops: stops.filter((s) => s.idx >= turn.index) },
    ];
    return { ...r, stops, ends, turnaround: turn, dirs };
  });
  const routeByNo = new Map(routes.map((r) => [r.no, r]));
  const byName = new Map(); const byArs = new Map();
  for (const r of routes) for (const s of r.stops) {
    if (s.virtual) continue;
    const k = normName(s.nameKo); if (!byName.has(k)) byName.set(k, []); byName.get(k).push({ routeNo: r.no, idx: s.idx });
    if (!byArs.has(s.arsId)) byArs.set(s.arsId, []); byArs.get(s.arsId).push({ routeNo: r.no, idx: s.idx });
  }
  const groups = physicalGroups(routes.filter((r) => r.category === 'owl'));
  return { routes, routeByNo, byName, byArs, ...groups };
}

/** 물리 그룹: 같은 이름(가상 표기 제거) · 400m 이내 union-find. 반환: groups[], visitGroup(`${no}:${idx}` → gid). */
export function physicalGroups(routes) {
  const members = [];
  for (const r of routes) for (const s of r.stops) if (!s.virtual) members.push({ routeNo: r.no, idx: s.idx, s });
  const parent = members.map((_, i) => i); const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const byName = new Map(); members.forEach((m, i) => { const k = normName(m.s.nameKo); if (!byName.has(k)) byName.set(k, []); byName.get(k).push(i); });
  for (const idxs of byName.values()) for (let a = 0; a < idxs.length; a++) for (let b = a + 1; b < idxs.length; b++) if (haversine(members[idxs[a]].s, members[idxs[b]].s) <= 400) parent[find(idxs[a])] = find(idxs[b]);
  const groups = new Map(); const visitGroup = new Map();
  members.forEach((m, i) => { const g = find(i); if (!groups.has(g)) groups.set(g, { id: g, name: m.s.nameKo, lat: m.s.lat, lon: m.s.lon, members: [], ars: new Set(), routes: new Set() }); const G = groups.get(g); G.members.push({ routeNo: m.routeNo, idx: m.idx }); G.ars.add(m.s.arsId); G.routes.add(m.routeNo); visitGroup.set(`${m.routeNo}:${m.idx}`, g); });
  return { groups: [...groups.values()], visitGroup };
}

/** 질의 → 정류장 방문 목록. 허브명(hubs: [{name, ars[]}]) 은 소속 정류소 전부로 펼친다. */
export function resolveQuery(nb, query, hubs = []) {
  const k = normName(query || ''); if (!k) return [];
  const exact = nb.byName.get(k) || [];
  const hub = hubs.find((h) => normName(h.name) === k || String(h.name).split('·').some((p) => normName(p) === k));
  if (hub) { const out = [...exact]; for (const a of hub.ars) for (const v of nb.byArs.get(a) || []) if (!out.some((x) => x.routeNo === v.routeNo && x.idx === v.idx)) out.push(v); if (out.length) return out; }
  if (exact.length) return exact;
  const keys = [...nb.byName.keys()].filter((x) => (isCho(k) ? choOf(x).startsWith(k) : x.startsWith(k) || x.includes(k)));
  return keys.slice(0, 40).flatMap((x) => nb.byName.get(x));
}

export function dirLabel(route, idx) { return idx < route.turnaround.index ? route.dirs[0].label : route.dirs[1].label; }
export function toward(route, idx) { return idx < route.turnaround.index ? route.dirs[0].toward : route.dirs[1].toward; }

const TRANSFER_PENALTY = 6;
/** 탑승~하차 사이 실제 정류장 수 (가상 정류소 제외). */
export function countStops(route, from, to) { let n = 0; for (let i = from + 1; i <= to; i++) if (!route.stops[i].virtual) n++; return n; }
/** 직통(같은 노선 · 진행 순서) → 물리 그룹 기준 1회 환승. 결과의 idx 는 route.stops 인덱스. */
export function findJourney(nb, originVisits, destVisits) {
  let best = null;
  for (const o of originVisits) for (const d of destVisits) { if (o.routeNo !== d.routeNo || o.idx >= d.idx) continue; const n = countStops(nb.routeByNo.get(o.routeNo), o.idx, d.idx); if (!best || n < best.stops) best = { type: 'direct', routeNo: o.routeNo, board: o.idx, alight: d.idx, stops: n }; }
  if (best) return best;
  const destByRoute = new Map(); for (const d of destVisits) { if (!destByRoute.has(d.routeNo)) destByRoute.set(d.routeNo, []); destByRoute.get(d.routeNo).push(d.idx); }
  const groupVisits = new Map(); for (const g of nb.groups) groupVisits.set(g.id, g.members);
  for (const o of originVisits) {
    const A = nb.routeByNo.get(o.routeNo); if (!A) continue;
    for (let a = o.idx + 1; a < A.stops.length; a++) {
      const gid = nb.visitGroup.get(`${A.no}:${a}`); if (gid === undefined) continue;
      for (const m of groupVisits.get(gid)) {
        if (m.routeNo === A.no) continue; const ds = destByRoute.get(m.routeNo); if (!ds) continue;
        for (const dIdx of ds) { if (m.idx >= dIdx) continue; const B = nb.routeByNo.get(m.routeNo); const n = countStops(A, o.idx, a) + countStops(B, m.idx, dIdx); const cost = n + TRANSFER_PENALTY; if (!best || cost < best.cost) best = { type: 'transfer', cost, stops: n, legs: [{ routeNo: A.no, board: o.idx, alight: a }, { routeNo: m.routeNo, board: m.idx, alight: dIdx }] }; }
      }
    }
  }
  return best || { type: 'none' };
}

/** 운행 시간대 판정 (자정 넘김 처리). official 없는 노선(공항)은 항상 false. */
export function isRunning(route, nowMin) { if (!route.official) return false; let f = toMin(route.official.firstBus), l = toMin(route.official.lastBus), n = nowMin; if (l < f) { l += 1440; if (n < f) n += 1440; } return n >= f && n <= l; }
/** 다음 첫차 (운행 전일 때). */
export function nextFirstBus(routes, nowMin) { const c = routes.filter((r) => r.official).map((r) => ({ route: r, m: toMin(r.official.firstBus) })).sort((a, b) => a.m - b.m); const next = c.find((x) => x.m > nowMin) || c[0]; if (!next) return null; let wait = next.m - nowMin; if (wait < 0) wait += 1440; return { route: next.route, waitMin: wait }; }
