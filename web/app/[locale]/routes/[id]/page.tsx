import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getVerifiedRoutes, getRouteById } from '../../../../lib/routes';
import { routing } from '../../../../i18n/routing';
import { RouteDiagram } from '../../../../components/route-detail/RouteDiagram';
import { StopsList } from '../../../../components/route-detail/StopsList';
import { MapLinkButton } from '../../../../components/route-detail/MapLinkButton';
import { InfoCard } from '../../../../components/ui/InfoCard';
import { Pill, StatusDot } from '../../../../components/ui/Pill';
import { LangToggle } from '../../../../components/ui/LangToggle';
import { Link } from '../../../../i18n/navigation';
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

  return {
    title: t('routeDetailTitle', { name }),
    description: t('routeDetailDescription', { name }),
  };
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
  const turnIdx = stops.findIndex((s) => s.isTurnaround);
  const turnStop = turnIdx >= 0 ? stops[turnIdx] : null;
  const startStop = stops[0];
  const endStop = stops[stops.length - 1];

  const startName = isKo
    ? startStop?.nameKo || route.startPointKo
    : route.startPoint;
  const endName = isKo
    ? endStop?.nameKo || route.endPointKo
    : route.endPoint;
  const turnName = turnStop ? turnStop.nameKo : '';

  return (
    <div className={styles.container}>
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
        <Pill variant="accent">
          <StatusDot color="var(--color-accent)" size={5} />
          <span>VERIFIED</span>
        </Pill>
        <LangToggle />
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

      {/* Route Diagram */}
      {stops.length > 0 && turnStop && (
        <div className={styles.section}>
          <RouteDiagram
            stops={stops}
            startName={startName}
            endName={endName}
            turnaroundName={turnName}
            outboundLabel={t('routeDetail.diagram.outbound', {
              from: startName,
              to: turnName,
            })}
            inboundLabel={t('routeDetail.diagram.inbound', {
              from: turnName,
              to: endName,
            })}
          />
        </div>
      )}

      {/* Info Cards 2x2 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          {t('routeDetail.info.verified')}
        </div>
        <div className={styles.infoGrid}>
          <InfoCard
            label={t('routeDetail.info.hours')}
            value={formatHours(route.firstBus, route.lastBus)}
          />
          <InfoCard
            label={t('routeDetail.info.days')}
            value={formatDays(route.daysOfOperation, t)}
          />
          <InfoCard
            label={t('routeDetail.info.stops')}
            value={t('routeDetail.stopsCount', { count: stops.length })}
            accent
          />
          <InfoCard
            label={t('routeDetail.info.verified')}
            value={formatDate(route.lastChecked, isKo)}
          />
        </div>
      </div>

      {/* Map Link */}
      <div className={styles.section}>
        <MapLinkButton
          displayNameKo={route.displayNameKo}
          label={t('routeDetail.openInKakaoMap')}
        />
      </div>

      {/* Stops List */}
      {stops.length > 0 && (
        <div className={styles.section}>
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

      {/* Footer */}
      <div className={styles.footerNote}>
        <span className={styles.footerIcon}>
          <InfoIcon />
        </span>
        <span className={styles.footerText}>
          {t('routeDetail.footer', {
            date: formatDate(route.lastChecked, isKo),
          })}
        </span>
      </div>
    </div>
  );
}
