/**
 * RT-2 — Stop 페이지 정적 노선 운행 안내 (base layer).
 *
 * 🔒 표현 계약 (docs/worklogs/RT2-ARRIVAL-CARD-DESIGN-20260901.md §3-2):
 *   여기 쓰이는 firstBus/lastBus 는 **노선 운행 기준값**이며 이 정류장의 도착 시각이 아니다.
 *   따라서 "이 정류장 첫차/막차" 로 읽히는 문구를 만들면 안 된다.
 *   RT-1 에서 API 의 firstTm(05:58)이 정적 첫차(03:30)와 어긋난 사례를 확인했다.
 *   같은 실수를 우리 화면에서 반복하지 않는다.
 *
 * 이 영역은 항상 존재한다. 실시간 카드는 이것을 대체하지 않고 위에 추가될 뿐이며,
 * 실시간이 실패해도 이 안내는 사라지지 않는다.
 */

import { useTranslations } from 'next-intl';
import styles from './StopServiceHours.module.css';

export type ServiceHoursEntry = {
  routeId: string;
  routeName: string;
  /** 노선 운행 기준 첫차. Stop 도착 시각이 아니다. */
  routeFirstBus: string;
  /** 노선 운행 기준 막차. Stop 도착 시각이 아니다. */
  routeLastBus: string;
  routeDaysOfOperation: string;
};

export function StopServiceHours({ entries }: { entries: ServiceHoursEntry[] }) {
  const t = useTranslations('stopDetail.serviceHours');
  if (entries.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="stop-service-hours-title">
      <h2 id="stop-service-hours-title" className={styles.title}>
        {t('title')}
      </h2>
      <ul className={styles.list}>
        {entries.map((entry) => (
          <li key={entry.routeId} className={styles.row}>
            <span className={styles.routeName}>{entry.routeName}</span>
            <span className={styles.hours}>
              {entry.routeFirstBus === entry.routeLastBus
                ? t('singleDeparture', { time: entry.routeFirstBus })
                : t('window', { first: entry.routeFirstBus, last: entry.routeLastBus })}
            </span>
          </li>
        ))}
      </ul>
      {/* "노선 운행 기준" 임을 문구로 명시한다 — 정류장별 도착 시각 오해를 막는 마지막 방어선 */}
      <p className={styles.note}>{t('note')}</p>
    </section>
  );
}
