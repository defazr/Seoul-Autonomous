'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { FixedRoute, OnDemandService } from '../../lib/types/route';
import { RouteCard } from '../ui/RouteCard';
import { RobotaxiCard } from '../ui/RobotaxiCard';
import { SegmentedControl } from '../ui/SegmentedControl';
import { StatusDot } from '../ui/Pill';
import { RouteGroupCard } from '../ui/RouteGroupCard';
import { SearchBar } from './SearchBar';
import styles from './RoutesList.module.css';

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--color-fg-2)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

function MoonStarIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--color-fg-2)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      <path d="M17 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
    </svg>
  );
}

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

  // Group card data
  const earlyRoutes = routes.filter((r) => {
    const hour = parseInt(r.firstBus.split(':')[0], 10);
    return hour < 5;
  });
  const lateRoutes = routes.filter((r) => {
    const fh = parseInt(r.firstBus.split(':')[0], 10);
    const lh = parseInt(r.lastBus.split(':')[0], 10);
    return fh >= 22 || lh >= 22;
  });
  const lateCount = lateRoutes.length + services.length;

  function getTimeRange(rts: FixedRoute[]): string {
    if (rts.length === 0) return '';
    const times = rts.flatMap((r) => [r.firstBus, r.lastBus]);
    const sorted = [...new Set(times)].sort();
    return sorted.length === 1 ? sorted[0] : `${sorted[0]}\u2013${sorted[sorted.length - 1]}`;
  }

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

      <div className={styles.countRibbon}>
        <StatusDot color="var(--color-accent)" size={6} />
        <span className={styles.countText}>
          {t('count', { count: total })}
        </span>
      </div>

      {(earlyRoutes.length > 0 || lateCount > 0) && (
        <div className={styles.groupGrid}>
          {earlyRoutes.length > 0 && (
            <RouteGroupCard
              href={`/${locale}/routes/early-morning`}
              icon={<MoonIcon />}
              title={t('groups.earlyMorningTitle')}
              meta={t('groups.meta', { count: earlyRoutes.length, range: getTimeRange(earlyRoutes) })}
            />
          )}
          {lateCount > 0 && (
            <RouteGroupCard
              href={`/${locale}/routes/late-night`}
              icon={<MoonStarIcon />}
              title={t('groups.lateNightTitle')}
              meta={t('groups.meta', { count: lateCount, range: getTimeRange(lateRoutes) })}
            />
          )}
        </div>
      )}

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
