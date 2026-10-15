'use client';

import { useState } from 'react';
import styles from './RouteExplorer.module.css';

export type ExplorerStop = { seq: number; arsId: string; name: string; others: string[]; hubSlug?: string; hubName?: string; turn: boolean };
export type ExplorerDir = {
  key: 'out' | 'in'; label: string; toward: string; stops: ExplorerStop[];
  ticks: { idx: number; x: number; y: number; name: string; arsId: string; turn: boolean }[];
  anchors: { node: string; x: number; y: number; idx: number }[]; outside: number;
};
export type ExplorerMap = { vb: { x: number; y: number; w: number; h: number }; riverD: string; lines: { no: string; d: string; color: string }[]; nodes: [number, number][] };
type Labels = { dirStops: string; meets: string; hubLink: string; turnaround: string; mapNote: string; mapOutside: string; boardText: string };

const shortName = (n: string) => (n === '서울역' ? n : n.replace(/역$/, ''));
const DISPLAY: Record<string, string> = { N72: '#C9CFDA' };
const DARK_TEXT = new Set(['N13', 'N15', 'N62', 'N73', 'N51', 'N72']);

export function RouteExplorer({ no, color, colors, dirs, map, labels, hubBase }: {
  no: string; color: string; colors: Record<string, string>; dirs: ExplorerDir[]; map: ExplorerMap; labels: Labels; hubBase: string;
}) {
  const [di, setDi] = useState(0);
  const d = dirs[di];
  const chip = (r: string) => (
    <span key={r} className={styles.chip} style={{ background: DISPLAY[r] ?? colors[r] ?? '#9AA3B2', color: DARK_TEXT.has(r) ? '#0B0F1A' : '#F3F5FA' }}>{r}</span>
  );
  return (
    <div className={styles.wrap}>
      <div className={styles.dir} role="group" aria-label="방면 선택">
        {dirs.map((x, i) => (
          <button key={x.key} type="button" aria-pressed={i === di} onClick={() => setDi(i)} style={i === di ? { background: color, color: DARK_TEXT.has(no) ? '#0B0F1A' : '#F3F5FA' } : undefined}>{x.label}</button>
        ))}
      </div>
      <p className={styles.board}>{labels.boardText.replace('{toward}', d.toward).replace('{first}', d.stops[0]?.name ?? '').replace('{last}', d.stops[d.stops.length - 1]?.name ?? '')}</p>

      <figure className={styles.mapbox}>
        <svg className={styles.svg} viewBox={`${map.vb.x} ${map.vb.y} ${map.vb.w} ${map.vb.h}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`${no} 노선도 · ${d.label}`}>
          <desc>ⓒ 2026 SeoulAutonomous.com · 서울 올빼미버스 노선도 도식 · 제작자가 직접 작도한 창작물 · All Rights Reserved · 무단 복제·재배포 금지</desc>
          <rect x={map.vb.x} y={map.vb.y} width={map.vb.w} height={map.vb.h} fill="#0B1226" />
          {map.riverD && <path d={map.riverD} fill="none" stroke="#1C3F6E" strokeWidth={48.5} strokeLinecap="round" strokeLinejoin="round" />}
          {map.lines.map((l) => (
            <path key={l.no} d={l.d} fill="none" stroke={DISPLAY[l.no] ?? l.color} strokeWidth={l.no === no ? 14 : 7} strokeOpacity={l.no === no ? 0.96 : 0.14} strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {map.nodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={6} fill="#0A0F1E" stroke="#D9DFEC" strokeWidth={2.5} opacity={0.3} />)}
          {d.ticks.map((t) => (
            <circle key={t.idx} cx={t.x} cy={t.y} r={t.turn ? 9 : 6} fill={color} stroke={t.turn ? '#F3F5FA' : '#0A0F1E'} strokeWidth={t.turn ? 4 : 2.5}><title>{`${t.name} ${t.arsId}${t.turn ? ` · ${labels.turnaround}` : ''}`}</title></circle>
          ))}
          {d.anchors.map((a) => (
            <g key={a.node}>
              <circle cx={a.x} cy={a.y} r={11} fill="#F3F5FA" stroke="#0A0F1E" strokeWidth={4} />
              <text x={a.x + 17} y={a.y + 9} fontSize={24} fontWeight={600} fill="#F3F5FA" stroke="#0A0F1E" strokeWidth={6} paintOrder="stroke" strokeLinejoin="round">{shortName(a.node)}</text>
            </g>
          ))}
        </svg>
        <figcaption className={styles.cap}>{labels.mapNote}{d.outside > 0 ? ` ${labels.mapOutside.replace('{n}', String(d.outside))}` : ''}</figcaption>
      </figure>

      <h3 className={styles.listTitle}>{labels.dirStops.replace('{toward}', d.toward).replace('{n}', String(d.stops.length))}</h3>
      <ol className={styles.timeline} style={{ ['--c' as string]: color }}>
        {d.stops.map((s) => (
          <li key={`${s.arsId}-${s.seq}`} className={`${s.others.length ? styles.meet : ''}${s.turn ? ` ${styles.turn}` : ''}`}>
            <span className={styles.ars}>{s.arsId}</span>
            <span className={styles.name}>
              <span>{s.name}{s.turn ? <em className={styles.turnTag}>{labels.turnaround}</em> : null}</span>
              {s.others.length ? <span className={styles.chips}><span className={styles.meets}>{labels.meets}</span>{s.others.map(chip)}{s.hubSlug ? <a className={styles.hub} href={`${hubBase}/${s.hubSlug}`}>{s.hubName} · {labels.hubLink}</a> : null}</span> : null}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
