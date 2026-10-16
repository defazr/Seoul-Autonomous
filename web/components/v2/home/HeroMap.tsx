'use client';

import { useTranslations } from 'next-intl';
import { useNightStatus, type ScheduleItem } from '../night/useNightStatus';
import styles from './home.module.css';

export type HeroMapProps = {
  lines: { no: string; d: string; color: string }[];
  nodes: [number, number][];
  hubs: { label: string; x: number; y: number }[];
  river: string;
  vb: { x: number; y: number; w: number; h: number };
  mvb: { x: number; y: number; w: number; h: number };
  schedule: ScheduleItem[];
};

/**
 * 홈 히어로 배경 = 포그린 CorelDRAW 노선도(night-bus-data.ts) 무보정 SVG. 운행 시간대 노선만 켜지고(lit) 나머지는 흐려진다(dim);
 * 시각을 모르는 SSR·운행 전에는 전부 soft. 데스크톱은 오른쪽 정렬(meet), 모바일은 카드 뒤 배경(slice) — 뷰박스가 달라 두 벌을 두고 CSS 로 고른다.
 */
export function HeroMap({ lines, nodes, hubs, river, vb, mvb, schedule }: HeroMapProps) {
  const t = useTranslations('nightHome.hero');
  const st = useNightStatus(schedule);
  const anyOn = st.ready && st.running.size > 0;
  const cls = (no: string) => (anyOn ? (st.running.has(no) ? styles.lit : styles.dim) : styles.soft);
  const body = (
    <>
      <desc>ⓒ 2026 SeoulAutonomous.com · 서울 올빼미버스 노선도 도식 · 제작자가 직접 작도한 창작물 · All Rights Reserved</desc>
      {river && <path className={styles.river} d={river} />}
      {lines.map((l, i) => <path key={l.no} className={`${styles.line} ${styles.draw} ${cls(l.no)}`} pathLength={1} style={{ stroke: l.color, animationDelay: `${i * 90}ms` }} d={l.d} />)}
      {nodes.map(([x, y], i) => <circle key={i} className={styles.node} cx={x} cy={y} r={7} />)}
      {hubs.map((h) => <g key={h.label}><circle className={styles.hubnode} cx={h.x} cy={h.y} r={11} /><text className={styles.lbl} x={h.x + 18} y={h.y + 9}>{h.label}</text></g>)}
    </>
  );
  return (
    <>
      <svg className={`${styles.heroMap} ${styles.heroMapDesk}`} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} preserveAspectRatio="xMaxYMid meet" aria-hidden="true" focusable="false">{body}</svg>
      <svg className={`${styles.heroMap} ${styles.heroMapMobile}`} viewBox={`${mvb.x} ${mvb.y} ${mvb.w} ${mvb.h}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">{body}</svg>
      <span className="v2-sr">{t('mapAria')}</span>
    </>
  );
}

/** 히어로 오른쪽 캡션 — 켜진 선 수. */
export function HeroCaption({ schedule }: { schedule: ScheduleItem[] }) {
  const t = useTranslations('nightHome.hero');
  const st = useNightStatus(schedule);
  if (!st.ready) return <span>{t('capInit')}</span>;
  return <span>{st.running.size > 0 ? t('capOn', { n: st.running.size }) : t('capOff')}</span>;
}
