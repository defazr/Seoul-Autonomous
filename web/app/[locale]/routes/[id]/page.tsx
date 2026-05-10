import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getVerifiedRoutes, getRouteById } from '../../../../lib/routes';
import { routing } from '../../../../i18n/routing';
import { StopsList } from '../../../../components/route-detail/StopsList';
import { MapLinkButton } from '../../../../components/route-detail/MapLinkButton';
import { Pill, StatusDot } from '../../../../components/ui/Pill';
import { Link } from '../../../../i18n/navigation';
import { SiteFooter } from '../../../../components/common/SiteFooter';
import { PageContainer } from '../../../../components/layout/PageContainer';
import { breadcrumbJsonLd } from '../../../../lib/seo/jsonld';
import { buildPageMetadata } from '../../../../lib/seo/metadata';
import styles from './page.module.css';

export function generateStaticParams() {
  const routes = getVerifiedRoutes();
  const params: { locale: string; id: string }[] = [];
  for (const locale of routing.locales) {
    for (const route of routes) {
      params.push({ locale, id: route.id });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const route = getRouteById(id);
  if (!route) return {};

  const t = await getTranslations({ locale, namespace: 'metadata' });
  const name = locale === 'ko' ? route.displayNameKo : route.displayName;

  return buildPageMetadata({
    locale,
    path: `/routes/${id}`,
    title: t('routeDetailTitle', { name }),
    description: t('routeDetailDescription', { name }),
  });
}

function formatDays(days: string, t: (key: string) => string): string {
  if (days === 'weekday') return t('routeDetail.days.weekday');
  if (days === 'weekend') return t('routeDetail.days.weekend');
  if (days === 'daily') return t('routeDetail.days.daily');
  return t('routeDetail.days.unknown');
}

function formatHours(first: string, last: string): string {
  if (first === last) return first;
  return `${first} – ${last}`;
}

function formatDate(dateStr: string, isKo: boolean): string {
  const d = new Date(dateStr + 'T00:00:00');
  if (isKo) {
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function BusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={12}
      height={12}
      fill="none"
      stroke="var(--color-fg-3)"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x={4} y={4} width={16} height={14} rx={2} />
      <circle cx={8} cy={20} r={1.5} />
      <circle cx={16} cy={20} r={1.5} />
      <path d="M4 12h16M9 4v8M15 4v8" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={12} cy={12} r={10} />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

export default async function RouteDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const route = getRouteById(id);

  if (!route) {
    notFound();
  }

  const t = await getTranslations({ locale });
  const isKo = locale === 'ko';

  const name = isKo ? route.displayNameKo : route.displayName;
  const subName = isKo ? route.displayName : route.displayNameKo;
  const stops = route.stops || [];

  return (
    <PageContainer width="default">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: 'Routes', path: '/routes' }, { name, path: '/routes/' + route.id }], locale)) }}
      />
      {/* TopBar */}
      <div className={styles.topBar}>
        <Link href="/routes" className={styles.backBtn}>
          <ChevronLeft />
        </Link>
        <div className={styles.badges}>
          <span className={styles.codeBadge}>
            {route.displayName.toUpperCase()}
          </span>
          <span className={styles.typeBadge}>
            <BusIcon />
            BUS
          </span>
        </div>
        <div className={styles.statusGroup}>
          <Pill variant="accent">
            <StatusDot color="var(--color-accent)" size={5} />
            <span>{t('status.verified')}</span>
          </Pill>
        </div>
      </div>

      {/* Title */}
      <div className={styles.titleSection}>
        <h1 className={styles.heading}>{name}</h1>
        <div className={styles.subName}>{subName}</div>
        <div className={styles.checkedDate}>
          {formatDate(route.lastChecked, isKo)}
        </div>
        <div className={styles.disclaimer}>
          {t('routeDetail.disclaimer')}
        </div>
      </div>

      {/* 2-column layout */}
      <div className={styles.twoColumn}>
        {/* Left: Stops */}
        <div className={styles.mainCol}>
          {stops.length > 0 && (
            <div className={styles.stopsCard}>
              <div className={styles.sectionTitle}>
                {t('routeDetail.stopsSection')} ({stops.length})
              </div>
              <StopsList
                  stops={stops}
                  locale={locale}
                  expandLabel={t('routeDetail.expandStops', {
                    count: stops.length,
                  })}
                  collapseLabel={t('routeDetail.collapseStops')}
                />
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSticky}>
            <div className={styles.sidebarCard}>
              <div className={styles.metaList}>
                {[
                  { label: t('routeDetail.info.hours'), value: formatHours(route.firstBus, route.lastBus) },
                  ...(route.daysOfOperation !== 'Unknown' ? [{ label: t('routeDetail.info.days'), value: formatDays(route.daysOfOperation, t) }] : []),
                  { label: t('routeDetail.info.stops'), value: t('routeDetail.stopsCount', { count: stops.length }) },
                  { label: t('routeDetail.info.verified'), value: formatDate(route.lastChecked, isKo) },
                ].map((item, i, arr) => (
                  <div key={i} className={`${styles.metaRow}${i < arr.length - 1 ? ` ${styles.metaRowBorder}` : ''}`}>
                    <span className={styles.metaLabel}>{item.label}</span>
                    <span className={item.value === '\u2014' ? styles.metaValueMuted : styles.metaValue}>
                      {item.value === 'Unknown' ? '\u2014' : item.value}
                    </span>
                  </div>
                ))}
              </div>

              <MapLinkButton
                displayNameKo={route.displayNameKo}
                label={t('routeDetail.openInKakaoMap')}
              />
            </div>

            <Link href="/routes" className={styles.allRoutesLink}>
              <ChevronLeft />
              {t('nav.viewAllRoutes')}
            </Link>
          </div>
        </aside>
      </div>

      {/* AEO FAQ section */}
      <div className={styles.aeoSection}>
        <h2 className={styles.aeoTitle}>{t('routeDetail.aeo.sectionTitle')}</h2>
        <dl className={styles.aeoList}>
          <div className={styles.aeoItem}>
            <dt className={styles.aeoQ}>{t('routeDetail.aeo.q1')}</dt>
            <dd className={styles.aeoA}>
              {t('routeDetail.aeo.a1', {
                firstStop: isKo ? (stops[0]?.nameKo || route.startPointKo) : route.startPoint,
                lastStop: isKo ? (stops[stops.length - 1]?.nameKo || route.endPointKo) : route.endPoint,
              })}
            </dd>
          </div>
          <div className={styles.aeoItem}>
            <dt className={styles.aeoQ}>{t('routeDetail.aeo.q2')}</dt>
            <dd className={styles.aeoA}>
              {t('routeDetail.aeo.a2', { firstBus: route.firstBus, lastBus: route.lastBus })}
            </dd>
          </div>
          {(route.daysOfOperation !== 'Unknown' || route.headway !== 'Unknown') && (
          <div className={styles.aeoItem}>
            <dt className={styles.aeoQ}>{t('routeDetail.aeo.q3')}</dt>
            <dd className={styles.aeoA}>
              {route.daysOfOperation !== 'Unknown' && t('routeDetail.aeo.a3days', { days: formatDays(route.daysOfOperation, t) })}
              {route.daysOfOperation !== 'Unknown' && route.headway !== 'Unknown' && ' '}
              {route.headway !== 'Unknown'
                ? t('routeDetail.aeo.a3headway', { headway: route.headway })
                : null}
            </dd>
          </div>
          )}
          <div className={styles.aeoItem}>
            <dt className={styles.aeoQ}>{t('routeDetail.aeo.q4')}</dt>
            <dd className={styles.aeoA}>
              {route.fare !== 'Unknown'
                ? t('routeDetail.aeo.a4fare', { fare: route.fare })
                : t('routeDetail.aeo.a4fareUnknown')}
              {' '}
              {route.reservationRequired !== 'Unknown'
                ? t('routeDetail.aeo.a4reservation', { reservation: route.reservationRequired })
                : t('routeDetail.aeo.a4reservationUnknown')}
              {' '}
              {(route.fare === 'Unknown' || route.reservationRequired === 'Unknown') && t('routeDetail.aeo.a4check')}
            </dd>
          </div>
          <div className={styles.aeoItem}>
            <dt className={styles.aeoQ}>{t('routeDetail.aeo.q5')}</dt>
            <dd className={styles.aeoA}>{t('routeDetail.aeo.a5')}</dd>
          </div>
          <div className={styles.aeoItem}>
            <dt className={styles.aeoQ}>{t('routeDetail.aeo.q6')}</dt>
            <dd className={styles.aeoA}>
              {t('routeDetail.aeo.a6')}
              {' '}
              <Link href="/how-to-ride" className={styles.aeoLink}>
                {t('routeDetail.aeo.a6link')}
              </Link>
            </dd>
          </div>
          <div className={styles.aeoItem}>
            <dt className={styles.aeoQ}>{t('routeDetail.aeo.q7')}</dt>
            <dd className={styles.aeoA}>
              {t('routeDetail.aeo.a7', { date: formatDate(route.lastChecked, isKo) })}
            </dd>
          </div>
        </dl>
      </div>

      <SiteFooter />
    </PageContainer>
  );
}
