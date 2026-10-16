'use client';

import { useTranslations } from 'next-intl';
import { StatusDot } from '../ui/Pill';
import { useNightStatus, type ScheduleItem } from './useNightStatus';
import styles from './StatusLine.module.css';

/** 홈 상단 상태줄 — "운행표 기준 n/14 노선 운행 시간대 · 기준 HH:MM KST". 도착정보가 아니라는 뜻을 문구에 고정. */
export function StatusLine({ schedule, owlTotal }: { schedule: ScheduleItem[]; owlTotal: number }) {
  const t = useTranslations('nightHome.status');
  const st = useNightStatus(schedule);
  const owlRunning = [...st.running].filter((no) => no !== 'A21').length;
  let text: React.ReactNode = t('init');
  if (st.ready) {
    if (owlRunning > 0) text = t.rich('running', { n: owlRunning, total: owlTotal, b: (c) => <b>{c}</b> });
    else if (st.next) {
      const h = Math.floor(st.next.waitMin / 60), m = st.next.waitMin % 60;
      text = t.rich(h ? 'before' : 'beforeSoon', { first: st.next.first, no: st.next.no, h, m, b: (c) => <b>{c}</b> });
    }
  }
  return (
    <div className={styles.status}>
      <span className={styles.item}><StatusDot on={st.ready && owlRunning > 0} />{text}</span>
      <span className={styles.item}>{t.rich('basis', { time: st.time, b: (c) => <b>{c}</b> })}{st.pinned && <span className={styles.pin}>{t('pinned')}</span>}</span>
    </div>
  );
}
