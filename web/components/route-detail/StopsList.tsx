'use client';

import { useState } from 'react';
import type { Stop } from '../../lib/types/route';
import styles from './StopsList.module.css';

type StopsListProps = {
  stops: Stop[];
  locale: string;
  expandLabel: string;
  collapseLabel: string;
};

function StopRow({
  stop,
  isFirst,
  isLast,
  isTurnaround,
}: {
  stop: Stop;
  isFirst: boolean;
  isLast: boolean;
  isTurnaround: boolean;
}) {
  const displayName = stop.nameEn || stop.nameKo;

  return (
    <div className={styles.stopRow}>
      <div className={styles.timeline}>
        <div
          className={`${styles.lineTop} ${isFirst ? styles.lineHidden : ''}`}
        />
        <div
          className={`${styles.stopDot} ${isTurnaround ? styles.stopDotTurnaround : ''}`}
        />
        <div
          className={`${styles.lineBottom} ${isLast ? styles.lineHidden : ''}`}
        />
      </div>
      <div className={styles.stopContent}>
        <div className={styles.stopMeta}>
          <span className={styles.stopSeq}>
            {String(stop.seq).padStart(2, '0')}
          </span>
          <span className={styles.stopName}>{displayName}</span>
        </div>
        {stop.nameEn && (
          <div className={styles.stopNameSub}>{stop.nameKo}</div>
        )}
      </div>
    </div>
  );
}

export function StopsList({
  stops,
  expandLabel,
  collapseLabel,
}: StopsListProps) {
  const [expanded, setExpanded] = useState(false);

  const turnIdx = stops.findIndex((s) => s.isTurnaround);
  const first = stops[0];
  const turn = turnIdx >= 0 ? stops[turnIdx] : null;
  const last = stops[stops.length - 1];

  const summaryStops = [first, turn, last].filter(Boolean) as Stop[];
  const displayStops = expanded ? stops : summaryStops;

  return (
    <div>
      <div>
        {displayStops.map((stop, i) => (
          <StopRow
            key={`${stop.seq}-${expanded}`}
            stop={stop}
            isFirst={i === 0}
            isLast={i === displayStops.length - 1}
            isTurnaround={stop.isTurnaround}
          />
        ))}
      </div>
      <button
        className={styles.toggleBtn}
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        {expanded ? collapseLabel : expandLabel}
      </button>
    </div>
  );
}
