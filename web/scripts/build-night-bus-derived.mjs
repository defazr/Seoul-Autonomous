/**
 * R3a-A2 — 파생 등록부 생성기 (재현 가능 · 커밋 대상 JSON 2개).
 *   web/data/night-bus-hubs.json              허브 16 (그룹 병합 규칙 + 슬러그 + 영문명)
 *   web/data/night-bus-schematic-anchors.json 노선도(night-bus-data.ts) 역 노드 ↔ 실제 정류장 매핑 (방면별 · 미매칭은 _meta 에 기록)
 * 사용: cd web && node scripts/build-night-bus-derived.mjs [--r2-data <out.json>]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import { loadNightBus, normName } from '../lib/night-bus/core.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(here, '..', 'data');
const doc = JSON.parse(readFileSync(path.join(DATA, 'night-bus-routes.json'), 'utf8'));
const nb = loadNightBus(doc);

/* ---- 노선도 작도 데이터 (TS · 읽기 전용) 를 수정 없이 평가 ---- */
function readSchematic() {
  let src = readFileSync(path.join(here, '..', 'app', '[locale]', 'night-bus-map', 'night-bus-data.ts'), 'utf8');
  src = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/export const /g, 'const ').replace(/: Record<[^=]*?> =/g, ' =').replace(/ as const/g, '').replace(/ as \[number, number\]/g, '');
  const ctx = {}; vm.runInNewContext(src + ';\nthis.__o={ROUTE_COLORS,NODES,ROUTE_POLY,ROUTE_MEMBER,ROUTE_ORDER,RIVER};', ctx); return ctx.__o;
}
const SC = readSchematic();

/* ---- 허브 16: 그룹 병합 규칙 (이름 정규식) · R3a 노출 3 은 registry.ts 가 정한다 ---- */
const HUB_RULES = [
  ['gangnam-station', '강남역', 'Gangnam Station', /^(강남역|지하철2호선강남역|대한사회복지회|아가방빌딩)/],
  ['hongdae-entrance', '홍대입구역', 'Hongik Univ. Station', /^(홍대입구역|동교동삼거리)$/],
  ['sinchon', '신촌', 'Sinchon', /^신촌오거리/],
  ['dongdaemun-station', '동대문역', 'Dongdaemun Station', /^(동대문역\.흥인지문|동묘앞)/],
  ['jongno-2ga-jonggak', '종로2가·종각', 'Jongno 2-ga · Jonggak', /^(종로2가|우리은행종로지점|을지로입구역\.광교)$/],
  ['seoul-station', '서울역', 'Seoul Station', /^(서울역버스환승센터|숭례문)$/],
  ['dongdaemun-history-culture-park', '동대문역사문화공원', 'Dongdaemun History & Culture Park', /^동대문역사문화공원$/],
  ['jongno-5ga-gwangjang-market', '종로5가·광장시장', 'Jongno 5-ga · Gwangjang Market', /^종로5가/],
  ['city-hall-euljiro', '시청·을지로입구', 'City Hall · Euljiro 1-ga', /^(시청역8번출구|시청앞\.덕수궁|소공동주민센터)$/],
  ['sinsa-nonhyeon', '신사역·논현역', 'Sinsa · Nonhyeon', /^(신사역|논현역)/],
  ['samseong-seolleung', '삼성역·선릉역', 'Samseong · Seolleung', /^(한국무역센터\.삼성역|선릉역|포스코)/],
  ['gyodae-station', '교대역', 'Seoul Nat’l Univ. of Education Station', /^(교대역2번출구|지하철2호선교대역)/],
  ['seoul-national-univ-station', '서울대입구역', 'Seoul Nat’l Univ. Station', /^서울대입구역/],
  ['konkuk-univ-station', '건대입구역', 'Konkuk Univ. Station', /^건대입구역/],
  ['hapjeong-station', '합정역', 'Hapjeong Station', /^합정역$/],
  ['cheongnyangni-station', '청량리역', 'Cheongnyangni Station', /^청량리역환승센터$/],
];
const candidates = nb.groups.filter((g) => g.routes.size >= 3);
const hubs = [];
for (const [slug, nameKo, nameEn, re] of HUB_RULES) {
  const gs = candidates.filter((g) => re.test(g.name)); if (!gs.length) { console.error('허브 규칙 매칭 0:', nameKo); continue; }
  const routes = [...new Set(gs.flatMap((g) => [...g.routes]))].sort(); const ars = [...new Set(gs.flatMap((g) => [...g.ars]))].sort();
  hubs.push({ slug, nameKo, nameEn, routes, ars, groups: gs.map((g) => g.name), lat: +(gs.reduce((a, g) => a + g.lat, 0) / gs.length).toFixed(6), lon: +(gs.reduce((a, g) => a + g.lon, 0) / gs.length).toFixed(6) });
}
hubs.sort((a, b) => b.routes.length - a.routes.length);
writeFileSync(path.join(DATA, 'night-bus-hubs.json'), JSON.stringify({ _meta: { generatedBy: 'web/scripts/build-night-bus-derived.mjs', rule: 'N노선 3개 이상 물리 그룹(같은 이름·400m) → 역세권 병합 규칙 HUB_RULES', source: 'night-bus-routes.json' }, hubs }, null, 1));

/* ---- 노선도 앵커: 역 노드 ↔ 실제 정류장 (방면별) ---- */
const ALIAS = { '종각역': ['종로2가'], '진관차고지': ['진관공영차고지'], '강동차고지': ['강동공영차고지'], '염곡차고지': ['염곡공영차고지', '염곡'], '중랑차고지': ['중랑공영차고지'], '양천차고지': ['양천공영차고지'], '구의역': ['구의'], '신촌역': ['신촌오거리'], '서울역': ['서울역버스환승센터', '서울역'], '강남역': ['강남역', '지하철2호선강남역'], '국민대': ['국민대앞'], '신림동': ['신림'], '홍대입구역': ['홍대입구역', '동교동삼거리'] };
/** 수동 확정 (노선:노드 → 정류장 이름 일부). 비어 있으면 자동 매칭만. */
const MANUAL = {};
function matchStop(nodeName, list, key) {
  const manual = MANUAL[key]; const base = normName(nodeName).replace(/역$/, ''); const cands = [normName(nodeName), ...(ALIAS[nodeName] || []).map(normName), ...(manual ? [normName(manual)] : [])];
  for (const s of list) { const k = normName(s.nameKo); if (cands.some((c) => k === c || k.includes(c)) || (base.length >= 2 && k.includes(base))) return s; }
  return null;
}
const anchors = {}; const unmatched = [];
for (const r of nb.routes) {
  if (!SC.ROUTE_POLY[r.no]) continue;
  anchors[r.no] = {};
  for (const d of r.dirs) {
    const list = d.stops.filter((s) => !s.virtual); const arr = [];
    for (const node of SC.ROUTE_MEMBER[r.no]) { const s = matchStop(node, list, `${r.no}:${node}`); if (s) { if (!arr.some((a) => a.idx === s.idx)) arr.push({ node, idx: s.idx, seq: s.seq, arsId: s.arsId, nameKo: s.nameKo }); } else unmatched.push(`${r.no}/${d.key}:${node}`); }
    arr.sort((a, b) => a.idx - b.idx); anchors[r.no][d.key] = arr;
  }
}
writeFileSync(path.join(DATA, 'night-bus-schematic-anchors.json'), JSON.stringify({ _meta: { generatedBy: 'web/scripts/build-night-bus-derived.mjs', rule: '노선도 역 노드 이름 ↔ 정류장 이름 (완전일치 · 포함 · ALIAS · MANUAL) · 방면별 · idx 는 route.stops 인덱스', unmatched }, anchors }, null, 1));

/* ---- 리포트 ---- */
console.log(`hubs ${hubs.length}:`, hubs.map((h) => `${h.nameKo}(${h.routes.length})`).join(' · '));
console.log(`anchors routes ${Object.keys(anchors).length} · unmatched ${unmatched.length}: ${unmatched.join(', ')}`);

/* ---- 옵션: R2 시안 데이터 (template.html 의 __DATA__) ---- */
const i = process.argv.indexOf('--r2-data');
if (i > -1) {
  const owl = nb.routes.filter((r) => r.category === 'owl');
  const out = { asOf: { stops: doc._meta.stopsSource.snapshot, schedule: doc._meta.scheduleSource.revisedOn }, routes: owl.map((r) => ({ no: r.no, id: r.busRouteId, color: r.color, ends: r.ends, first: r.official.firstBus, last: r.official.lastBus, headway: r.official.headway, vehicles: r.official.vehicles, km: r.official.distanceKm, turn: r.turnaround.seq, stops: r.stops.filter((s) => !s.virtual).map((s) => [s.seq, s.arsId, s.nameKo, +s.lat.toFixed(5), +s.lon.toFixed(5)]) })), hubs: hubs.map((h) => ({ name: h.nameKo, routes: h.routes, ars: h.ars, lat: h.lat, lon: h.lon, groups: h.groups })), schematic: { vb: { x: -70, y: -65, w: 2560, h: 1600 }, mvb: { x: 110, y: 17, w: 2200, h: 1436 }, colors: SC.ROUTE_COLORS, order: SC.ROUTE_ORDER, nodes: SC.NODES, poly: SC.ROUTE_POLY, member: SC.ROUTE_MEMBER, river: SC.RIVER } };
  writeFileSync(process.argv[i + 1], JSON.stringify(out)); console.log('r2-data →', process.argv[i + 1]);
}
