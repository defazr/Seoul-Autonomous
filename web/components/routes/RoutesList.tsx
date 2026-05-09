'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { FixedRoute, OnDemandService } from '../../lib/types/route';
import { RouteCard } from '../ui/RouteCard';
import { RobotaxiCard } from '../ui/RobotaxiCard';
import { SegmentedControl } from '../ui/SegmentedControl';
import { StatusDot } from '../ui/Pill';
import { SearchBar } from './SearchBar';
import styles from './RoutesList.module.css';

type RoutesListProps = {
  routes: FixedRoute[];
  services: OnDemandService[];
  locale: string;
};

type Filter = 'ALL' | 'BUS' | 'TAXI';

const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '');

function matchRouteQuery(route: FixedRoute, q: string): boolean {
  if (!q.trim()) return true;
  const nq = normalize(q);
  const fields = [
    route.displayName,
    route.displayNameKo,
    route.startPoint,
    route.startPointKo,
    route.endPoint,
    route.endPointKo,
  ];
  return fields.some((f) => normalize(f).includes(nq));
}

function matchServiceQuery(service: OnDemandService, q: string): boolean {
  if (!q.trim()) return true;
  const nq = normalize(q);
  const fields = [
    service.displayName,
    service.displayNameKo,
    service.serviceArea,
    service.serviceAreaKo,
  ];
  return fields.some((f) => normalize(f).includes(nq));
}

function SensorIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx={12} cy={12} r={9} />
      <circle cx={12} cy={12} r={5} />
      <circle cx={12} cy={12} r={1.5} fill="currentColor" />
    </svg>
  );
}

export function RoutesList({ routes, services, locale }: RoutesListProps) {
  const t = useTranslations('routes');
  const ts = useTranslations('status');

  const [filter, setFilter] = useState<Filter>('ALL');
  const [query, setQuery] = useState('');

  const showBus = filter === 'ALL' || filter === 'BUS';
  const showTaxi = filter === 'ALL' || filter === 'TAXI';

  const filteredBus = showBus ? routes.filter((r) => matchRouteQuery(r, query)) : [];
  const filteredTaxi = showTaxi ? services.filter((s) => matchServiceQuery(s, query)) : [];
  const total = filteredBus.length + filteredTaxi.length;

  const filterOptions = [
    { value: 'ALL', label: t('filter.all') },
    { value: 'BUS', label: t('filter.bus') },
    { value: 'TAXI', label: t('filter.robotaxi') },
  ];

  const robotaxiLabels = {
    appRequired: t('robotaxi.appRequired'),
    checkBeforeRiding: t('robotaxi.checkBeforeRiding'),
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>{t('title')}</h1>
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={t('search.placeholder')}
      />

      <SegmentedControl
        options={filterOptions}
        value={filter}
        onChange={(v) => setFilter(v as Filter)}
      />

      <div className={styles.groupLinks}>
        <a href={`/${locale}/routes/early-morning`} className={styles.groupLink}>
          {t('groups.earlyMorning')}
        </a>
        <a href={`/${locale}/routes/late-night`} className={styles.groupLink}>
          {t('groups.lateNight')}
        </a>
      </div>

      <div className={styles.countRibbon}>
        <StatusDot color="var(--color-accent)" size={6} />
        <span className={styles.countText}>
          {t('count', { count: total })}
        </span>
      </div>

      {filteredBus.length > 0 && (
        <>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionLabelText}>{t('section.verified')}</span>
            <span className={styles.sectionCount}>
              {String(filteredBus.length).padStart(2, '0')}
            </span>
          </div>
          <div className={styles.list}>
            {filteredBus.map((route) => (
              <RouteCard key={route.id} route={route} locale={locale} verifiedLabel={ts('verified')} />
            ))}
          </div>
        </>
      )}

      {filteredTaxi.length > 0 && (
        <>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionLabelText}>{t('section.robotaxi')}</span>
            <span className={styles.sectionCount}>
              {String(filteredTaxi.length).padStart(2, '0')}
            </span>
          </div>
          <div className={styles.list}>
            {filteredTaxi.map((svc) => (
              <RobotaxiCard
                key={svc.id}
                service={svc}
                locale={locale}
                labels={robotaxiLabels}
              />
            ))}
          </div>
        </>
      )}

      {total === 0 && (
        <div className={styles.empty}>
          {query.trim() ? t('search.empty') : t('empty')}
        </div>
      )}

    </div>
  );
}
