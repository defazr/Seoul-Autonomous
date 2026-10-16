'use client';

import { useTranslations } from 'next-intl';
import { Link } from '../../../i18n/navigation';
import { StatusDot } from '../ui/Pill';
import { useNightStatus, type ScheduleItem } from '../night/useNightStatus';
import { useSearch } from './SearchContext';
import styles from './home.module.css';

/** 허브 카드 아랫줄 — 운행표 기준 "운행 시간대 n/6" · 「여기서 출발」(질문 카드 출발지로) · 허브 페이지 링크(노출 3곳). */
export function HubCardActions({ name, slug, exposed, schedule }: { name: string; slug: string; exposed: boolean; schedule: ScheduleItem[] }) {
  const t = useTranslations('nightHome.hubs');
  const st = useNightStatus(schedule);
  const s = useSearch();
  return (
    <div className={styles.hubFoot}>
      <span className={styles.hubService}><StatusDot on={st.ready && st.running.size > 0} />{st.ready ? t('inService', { n: st.running.size, total: schedule.length }) : t('inServiceInit')}</span>
      <span className={styles.hubActions}>
        <button type="button" className={styles.hubAct} onClick={() => s.useAsOrigin(name)}>{t('useAsOrigin')} ↑</button>
        {exposed && <Link href={`/hubs/${slug}`} locale="ko" className={styles.hubLink}>{t('page')} →</Link>}
      </span>
    </div>
  );
}
