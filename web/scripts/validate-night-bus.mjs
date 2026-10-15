/**
 * R1 — night-bus-routes.json 검증 + 파생 지표 (반환점 · 물리 그룹 · 허브 후보).
 * 사용: cd web && node scripts/validate-night-bus.mjs [--json <출력경로>]
 * 불변식 위반 시 exit 1 (숫자 맞추기 금지 — 의미가 다르면 BLOCK).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const SSOT = path.join(here, '..', 'data', 'night-bus-routes.json');
const doc = JSON.parse(readFileSync(SSOT, 'utf8'));
const OWL = ['N13','N15','N16','N26','N30','N31','N37','N51','N61','N62','N64','N72','N73','N75'];
const SEOUL_BBOX = { minLon: 126.3, maxLon: 127.5, minLat: 37.2, maxLat: 37.8 }; // 공항 포함 여유

const normName = (n) => n.replace(/\s+/g, '').replace(/[().·,]/g, '');
const fails = [];
const check = (ok, msg) => { if (!ok) fails.push(msg); };

function haversine(a, b) {
  const R = 6371000, toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lon - a.lon);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// 1. 노선 집합
const owl = doc.routes.filter((r) => r.category === 'owl');
const airport = doc.routes.filter((r) => r.category === 'airport-night');
const AIRPORT = ['N6000','N6002','N6701','N6703']; // 2026-09-02 파일 기준 공항 심야 집합. 바뀌면 의미를 확인하고 이 상수를 갱신한다
check(doc.routes.length === 18, `전체 노선 수 ${doc.routes.length} ≠ 18`);
check(owl.length === 14, `owl 노선 수 ${owl.length} ≠ 14`);
check(airport.length === 4 && AIRPORT.every((n) => airport.some((r) => r.no === n)), `공항 심야 집합 불일치: ${airport.map((r) => r.no).join(',')}`);
check(doc.routes.every((r) => r.category === 'owl' || r.category === 'airport-night'), '카테고리 값 불명');
check(airport.every((r) => !r.official), '공항 노선에 official 블록이 있음 (운행표 출처 없음)');
check(doc.routes.every((r) => r.no && r.id === r.no.toLowerCase() && /^\d{9}$/.test(r.busRouteId)), 'no/id/busRouteId 형식');
check(OWL.every((n) => owl.some((r) => r.no === n)), `공식 14노선 누락: ${OWL.filter((n) => !owl.some((r) => r.no === n)).join(',')}`);
check(new Set(doc.routes.map((r) => r.busRouteId)).size === doc.routes.length, 'busRouteId 중복');

// 2. 노선별 불변식 + 파생
const derived = [];
for (const r of doc.routes) {
  const seqs = r.stops.map((s) => s.seq);
  check(seqs.every((s, i) => s === i + 1), `${r.no}: 순번 비연속`);
  check(r.stopCount === r.stops.length, `${r.no}: stopCount 불일치`);
  for (const s of r.stops) {
    check(/^\d{5}$/.test(s.arsId) && s.arsId !== '00000', `${r.no}: arsId 결손·형식 ${JSON.stringify(s.arsId)} (${s.nameKo})`);
    check(typeof s.nodeId === 'string' && /^\d{6,9}$/.test(s.nodeId), `${r.no}: nodeId 결손·형식 ${JSON.stringify(s.nodeId)}`);
    check(typeof s.nameKo === 'string' && s.nameKo.trim().length > 0, `${r.no}: 정류소명 결손 seq=${s.seq}`);
    check(s.lon >= SEOUL_BBOX.minLon && s.lon <= SEOUL_BBOX.maxLon && s.lat >= SEOUL_BBOX.minLat && s.lat <= SEOUL_BBOX.maxLat, `${r.no}: 좌표 범위 밖 ${s.nameKo} ${s.lon},${s.lat}`);
  }
  if (r.category === 'owl') {
    check(r.color && /^#[0-9A-F]{6}$/i.test(r.color), `${r.no}: color 없음`);
    check(r.official && r.official.firstBus && r.official.lastBus && r.official.headway, `${r.no}: official 운행표 없음`);
  }
  // 반환점 = 전후 정류장 열이 거울처럼 맞아떨어지는 지점 (왕복형). "가장 먼 정류장" 은 N31 처럼
  // 경로가 꺾이는 노선에서 틀리므로 쓰지 않는다. 점수 = i 를 중심으로 ±j 정류장이 같은 이름이거나 200m 이내인 j 의 수.
  const first = r.stops[0];
  const same = (a, b) => normName(a.nameKo) === normName(b.nameKo) || haversine(a, b) <= 200;
  let best = -1, farIdx = 0;
  for (let i = 1; i < r.stops.length - 1; i++) {
    let score = 0;
    for (let j = 1; i - j >= 0 && i + j < r.stops.length; j++) { if (same(r.stops[i - j], r.stops[i + j])) score++; }
    if (score > best) { best = score; farIdx = i; }
  }
  const far = haversine(first, r.stops[farIdx]);
  const half = Math.max(1, Math.min(farIdx, r.stops.length - 1 - farIdx));
  const symmetry = +(Math.max(0, best) / half).toFixed(2);
  // 반환점은 파생 지표이지 불변식이 아니다. 대칭 0.15 미만이면 "자동 추정 불가" 로 표시해 UI 가 공식 기·종점 이름만 쓰게 한다.
  const turnaroundReliable = r.category === 'owl' && symmetry >= 0.15;
  const last = r.stops[r.stops.length - 1];
  const closesLoop = haversine(first, last) < 600; // 차고지 복귀
  // 인접 정류장 간 최대 간격 (데이터 이상 탐지)
  let maxGap = 0;
  for (let i = 1; i < r.stops.length; i++) maxGap = Math.max(maxGap, haversine(r.stops[i - 1], r.stops[i]));
  check(maxGap < 6000 || r.category === 'airport-night', `${r.no}: 인접 정류장 간격 ${Math.round(maxGap)}m 이상치`);
  derived.push({ no: r.no, stops: r.stops.length, turnaroundSeq: farIdx + 1, turnaroundName: r.stops[farIdx].nameKo, turnaroundDistKm: +(far / 1000).toFixed(1), symmetry, turnaroundReliable, closesLoop, maxGapM: Math.round(maxGap), ends: r.official?.ends });
}

// 3. 물리 그룹 (같은 이름 · 150m 이내) → 허브 후보 (서로 다른 N노선 수)
const VIRTUAL = /[(（]\s*가상/; // "(가상)" · "(가상정류소)" · 전각 괄호 변형까지 가상으로 본다
const norm = (n) => normName(n.replace(/[(（]\s*가상[^)）]*[)）]/g, ''));
const members = []; // {route, stop} — 가상 정류소는 사용자 안내 대상이 아니므로 허브 집계에서 제외
for (const r of owl) for (const s of r.stops) if (!VIRTUAL.test(s.nameKo)) members.push({ route: r.no, s });
const parent = members.map((_, i) => i);
const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
const union = (a, b) => { parent[find(a)] = find(b); };
const byName = new Map();
members.forEach((m, i) => { const k = norm(m.s.nameKo); if (!byName.has(k)) byName.set(k, []); byName.get(k).push(i); });
for (const idxs of byName.values()) {
  for (let a = 0; a < idxs.length; a++) for (let b = a + 1; b < idxs.length; b++) {
    if (haversine(members[idxs[a]].s, members[idxs[b]].s) <= 400) union(idxs[a], idxs[b]); // 같은 이름 · 길 건너편까지 한 허브
  }
}
const groups = new Map();
members.forEach((m, i) => { const g = find(i); if (!groups.has(g)) groups.set(g, { name: m.s.nameKo, routes: new Set(), ars: new Set(), lat: m.s.lat, lon: m.s.lon }); const G = groups.get(g); G.routes.add(m.route); G.ars.add(m.s.arsId); });
// 400m 는 union-find 간선 기준이라 그룹 직경이 더 클 수 있다 → 직경을 실측해 보고한다 (상한 600m 초과 시 FAIL)
let maxDiameter = 0;
{ const byG = new Map(); members.forEach((m, i) => { const g = find(i); if (!byG.has(g)) byG.set(g, []); byG.get(g).push(m.s); });
  for (const list of byG.values()) for (let a = 0; a < list.length; a++) for (let b = a + 1; b < list.length; b++) maxDiameter = Math.max(maxDiameter, haversine(list[a], list[b])); }
check(maxDiameter <= 600, `물리 그룹 직경 ${Math.round(maxDiameter)}m > 600m`);
const hubs = [...groups.values()].map((g) => ({ name: g.name, routes: [...g.routes].sort(), ars: [...g.ars].sort(), lat: g.lat, lon: g.lon })).filter((g) => g.routes.length >= 3).sort((a, b) => b.routes.length - a.routes.length || a.name.localeCompare(b.name, 'ko'));

const uniqueArs = new Set(members.map((m) => m.s.arsId)).size;
const summary = { routes: doc.routes.length, owl: owl.length, airport: airport.length, stopVisits: members.length, uniqueArs, physicalGroups: groups.size, maxGroupDiameterM: Math.round(maxDiameter), hubCandidates3plus: hubs.length };

console.log('=== night-bus SSoT 검증');
console.log(summary);
console.log('=== 파생 (반환점 · 차고지 복귀 · 최대 인접 간격)');
for (const d of derived) console.log(`${d.no.padEnd(6)} stops=${String(d.stops).padStart(3)} turn@${String(d.turnaroundSeq).padStart(3)}/${d.stops} ${d.turnaroundName} (${d.turnaroundDistKm}km · 대칭 ${d.symmetry}${d.turnaroundReliable ? '' : ' · 자동추정 불가'}) loop=${d.closesLoop ? 'Y' : 'N'} maxGap=${d.maxGapM}m ends=${d.ends ? d.ends.join('~') : '-'}`);
console.log('=== 허브 후보 (N노선 3개 이상 · 이름 동일 · 400m 그룹 · 가상 제외)');
for (const h of hubs) console.log(`${String(h.routes.length).padStart(2)}  ${h.name.padEnd(22)} ${h.routes.join(' ')}   ars=${h.ars.join('/')}`);
const jsonOut = process.argv.indexOf('--json');
if (jsonOut > -1) writeFileSync(process.argv[jsonOut + 1], JSON.stringify({ summary, derived, hubs }, null, 1));
// ---- R3a 파생 등록부 (있을 때만 검사) ----
import('node:fs').then(({ existsSync }) => {
  const hubsPath = path.join(here, '..', 'data', 'night-bus-hubs.json'), ancPath = path.join(here, '..', 'data', 'night-bus-schematic-anchors.json');
  const dfails = [];
  if (existsSync(hubsPath)) { const H = JSON.parse(readFileSync(hubsPath, 'utf8')).hubs; const allArs = new Set(doc.routes.flatMap((r) => r.stops.map((s) => s.arsId)));
    if (H.length !== 16) dfails.push(`hubs ${H.length} ≠ 16`); for (const h of H) { if (!/^[a-z0-9-]+$/.test(h.slug)) dfails.push(`hub slug ${h.slug}`); for (const a of h.ars) if (!allArs.has(a)) dfails.push(`hub ${h.nameKo} ARS ${a} 미존재`); if (h.routes.length < 3) dfails.push(`hub ${h.nameKo} 노선 ${h.routes.length} < 3`); } if (new Set(H.map((h) => h.slug)).size !== H.length) dfails.push('hub slug 중복'); }
  if (existsSync(ancPath)) { const A = JSON.parse(readFileSync(ancPath, 'utf8')); for (const [no, dirs] of Object.entries(A.anchors)) { const r = doc.routes.find((x) => x.no === no); if (!r) { dfails.push(`anchors 노선 ${no} 미존재`); continue; } for (const list of Object.values(dirs)) for (const a of list) { const s = r.stops[a.idx]; if (!s || s.arsId !== a.arsId) dfails.push(`anchor ${no} ${a.node} idx/ARS 불일치`); } } console.log(`anchors unmatched ${A._meta.unmatched.length} (편도 구간·그림 전용 노드는 정상 — R3b 수동표로 확정)`); }
  if (dfails.length) { console.error(`DERIVED FAIL ${dfails.length}건`); for (const f of dfails.slice(0, 20)) console.error(' - ' + f); process.exit(1); } else console.log('derived registries OK');
});
if (fails.length) { console.error(`\nFAIL ${fails.length}건`); for (const f of fails.slice(0, 40)) console.error(' - ' + f); process.exit(1); }
console.log(`\nPASS — 불변식 위반 0`);
