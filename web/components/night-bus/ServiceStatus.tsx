'use client';

import { useEffect, useState } from 'react';
import styles from './ServiceStatus.module.css';

type Props = { first: string; last: string; labels: { label: string; running: string; before: string; beforeSoon: string; note: string } };
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
function kstMin(): number { const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()); return Number(p.find((x) => x.type === 'hour')!.value) * 60 + Number(p.find((x) => x.type === 'minute')!.value); }

/** 운행표 기준 시간대 표시 — 도착정보가 아니다. SSR 에서는 비워 두고 클라이언트 시각으로만 채운다 (서버 비용 0 · 캐시 안전). */
export function ServiceStatus({ first, last, labels }: Props) {
  const [text, setText] = useState<{ on: boolean; msg: string } | null>(null);
  useEffect(() => {
    const tick = () => {
      const now = kstMin(); const f = toMin(first); let l = toMin(last), n = now; if (l < f) { l += 1440; if (n < f) n += 1440; }
      if (n >= f && n <= l) { setText({ on: true, msg: labels.running.replace('{first}', first).replace('{last}', last) }); return; }
      let wait = toMin(first) - now; if (wait < 0) wait += 1440; const h = Math.floor(wait / 60), m = wait % 60;
      setText({ on: false, msg: (h ? labels.before : labels.beforeSoon).replace('{first}', first).replace('{h}', String(h)).replace('{m}', String(m)) });
    };
    tick(); const id = setInterval(tick, 30000); return () => clearInterval(id);
  }, [first, last, labels]);
  return (
    <div className={styles.box}>
      <span className={`${styles.dot}${text?.on ? ` ${styles.on}` : ''}`} aria-hidden="true" />
      <span className={styles.label}>{labels.label}</span>
      <span className={styles.msg}>{text?.msg ?? `${first} ~ ${last}`}</span>
      <p className={styles.note}>{labels.note}</p>
    </div>
  );
}
