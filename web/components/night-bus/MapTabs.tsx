'use client';

import { useState, type ReactNode } from 'react';
import styles from './MapTabs.module.css';

/** 「실제 지도 | 노선도」 전환. 두 패널 모두 서버에서 준비된 내용을 받는다. */
export function MapTabs({ labels, real, schematic }: { labels: [string, string]; real: ReactNode; schematic: ReactNode }) {
  const [i, setI] = useState(0);
  return (
    <div className={styles.box}>
      <div className={styles.tabs} role="tablist">{labels.map((l, k) => <button key={l} type="button" role="tab" aria-selected={i === k} onClick={() => setI(k)}>{l}</button>)}</div>
      <div hidden={i !== 0}>{real}</div>
      <div hidden={i !== 1}>{schematic}</div>
    </div>
  );
}
