'use client';

import { useState, type ReactNode } from 'react';
import styles from './MapTabs.module.css';

/** 「실제 지도 | 노선도」 전환. 두 패널 모두 서버에서 준비된 내용을 받는다. */
export function MapTabs({ labels, real, schematic, label = '지도 종류' }: { labels: [string, string]; real: ReactNode; schematic: ReactNode; label?: string }) {
  const [i, setI] = useState(0);
  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const n = i === 0 ? 1 : 0; setI(n); (e.currentTarget.querySelectorAll('button')[n] as HTMLButtonElement | undefined)?.focus(); } };
  return (
    <div className={styles.box}>
      <div className={styles.tabs} role="tablist" aria-label={label} onKeyDown={onKey}>{labels.map((l, k) => <button key={l} id={`maptab-${k}`} type="button" role="tab" aria-selected={i === k} aria-controls={`mappanel-${k}`} tabIndex={i === k ? 0 : -1} onClick={() => setI(k)}>{l}</button>)}</div>
      <div id="mappanel-0" role="tabpanel" aria-labelledby="maptab-0" hidden={i !== 0}>{real}</div>
      <div id="mappanel-1" role="tabpanel" aria-labelledby="maptab-1" hidden={i !== 1}>{schematic}</div>
    </div>
  );
}
