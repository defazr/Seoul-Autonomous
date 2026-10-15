import { allRouteLines, RIVER, NODES, SCHEMATIC_VB, shortName } from '../../lib/night-bus/schematic';
import styles from './HubSchematic.module.css';

const DISPLAY: Record<string, string> = { N72: '#C9CFDA' };
/** 허브 slug → 노선도 역 노드 (night-bus-data.ts NODES 키). 작도 무수정. */
export const HUB_NODE: Record<string, string> = { 'gangnam-station': '강남역', 'hongdae-entrance': '홍대입구역', sinchon: '신촌역', 'dongdaemun-station': '동대문역', 'jongno-2ga-jonggak': '종각역', 'seoul-station': '서울역', 'dongdaemun-history-culture-park': '동대문역사문화공원역', 'city-hall-euljiro': '시청역', 'sinsa-nonhyeon': '논현역', 'samseong-seolleung': '삼성역', 'gyodae-station': '교대역', 'seoul-national-univ-station': '서울대입구역', 'konkuk-univ-station': '건대입구역', 'hapjeong-station': '합정역', 'cheongnyangni-station': '청량리역' };

/** 운영자 노선도 위에 허브 노선만 켜고 허브 역을 표시 (서버 렌더 SVG). */
export function HubSchematic({ slug, routes, title }: { slug: string; routes: string[]; title: string }) {
  const node = HUB_NODE[slug]; const p = node ? NODES[node] : undefined; const vb = SCHEMATIC_VB;
  const view = p ? { x: p[0] - 640, y: p[1] - 400, w: 1280, h: 800 } : vb;
  return (
    <svg className={styles.svg} viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title}>
      <desc>ⓒ 2026 SeoulAutonomous.com · 서울 올빼미버스 노선도 도식 · 제작자가 직접 작도한 창작물 · All Rights Reserved</desc>
      <rect x={vb.x} y={vb.y} width={vb.w} height={vb.h} fill="#0B1226" />
      {RIVER.d && <path d={RIVER.d} fill="none" stroke="#1C3F6E" strokeWidth={48.5} strokeLinecap="round" strokeLinejoin="round" />}
      {allRouteLines().map((l) => <path key={l.no} d={l.d} fill="none" stroke={DISPLAY[l.no] ?? l.color} strokeWidth={routes.includes(l.no) ? 12 : 6} strokeOpacity={routes.includes(l.no) ? 0.96 : 0.14} strokeLinecap="round" strokeLinejoin="round" />)}
      {Object.entries(NODES).map(([n, [x, y]]) => <circle key={n} cx={x} cy={y} r={6} fill="#0A0F1E" stroke="#D9DFEC" strokeWidth={2.5} opacity={n === node ? 0 : 0.35} />)}
      {p && <g><circle cx={p[0]} cy={p[1]} r={24} fill="none" stroke="#00D4FF" strokeWidth={5} /><circle cx={p[0]} cy={p[1]} r={11} fill="#F3F5FA" stroke="#0A0F1E" strokeWidth={4} /><text x={p[0] + 24} y={p[1] + 10} fontSize={28} fontWeight={700} fill="#F3F5FA" stroke="#0A0F1E" strokeWidth={7} paintOrder="stroke" strokeLinejoin="round">{shortName(node)}</text></g>}
    </svg>
  );
}
