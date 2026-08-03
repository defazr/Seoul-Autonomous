import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getVerifiedRoutes, getRouteById } from '../../../../lib/routes';
import { routeContextKo } from '../../../../data/route-context/route-context.ko';
import { routeContextEn } from '../../../../data/route-context/route-context.en';
import type { VerifiedRouteId } from '../../../../lib/types/route-context';
import { routing } from '../../../../i18n/routing';
import { StopsList } from '../../../../components/route-detail/StopsList';
import { getOfficialStopNameEn } from '../../../../lib/stops';
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

  const contextMap = isKo ? routeContextKo : routeContextEn;
  const context = contextMap[route.id as VerifiedRouteId];
  if (!context) {
    throw new Error(`Missing route context for route id: ${route.id}`);
  }

  // 26-C2E: 표시명 해결은 서버에서 끝낸다 (SSOT 는 client bundle 로 나가지 않는다).
  // 보조줄 노출 여부는 StopsList 가 렌더 문맥(미리보기/전체)에 따라 결정한다.
  // 26-C2E.1: 영문 표시명의 유일한 출처는 공식 SSOT 다. 미스는 한국어명으로만 대체한다
  // (routes.json 의 legacy nameEn 은 표시 경로에서 사용하지 않는다).
  const displayStops = stops.map((stop) => {
    if (isKo) {
      return {
        seq: stop.seq,
        displayName: stop.nameKo,
        isTurnaround: stop.isTurnaround,
      };
    }
    const officialNameEn = getOfficialStopNameEn(stop.stopId);
    return {
      seq: stop.seq,
      displayName: officialNameEn ?? stop.nameKo,
      secondaryName: officialNameEn ? stop.nameKo : undefined,
      isTurnaround: stop.isTurnaround,
    };
  });

  // 26-C2O: 공식 확인된 운영정보만 표시한다. 미확인 항목은 행 자체를 만들지 않는다.
  const fareCell = route.fare;
  const operatorCell = route.operator;
  const fareValue = fareCell.value;
  const showTemporaryFree =
    fareCell.verificationGrade === 'official_confirmed' &&
    fareCell.currentState === 'confirmed' &&
    fareValue?.kind === 'temporary_free';
  const showOperator =
    operatorCell.verificationGrade === 'official_confirmed' &&
    operatorCell.currentState === 'confirmed' &&
    !!operatorCell.value;
  const needsFareReverification = fareCell.currentState === 'reverification_required';

  const formatSourceDate = (iso: string) => {
    const [y, m, d] = iso.split('-');
    if (isKo) return `${y}.${m}.${d}`;
    const month = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ][Number(m) - 1];
    return `${month} ${Number(d)}, ${y}`;
  };

  // 공식확인 필드가 같은 출처를 공유하면 링크를 한 번만 보여준다.
  const operationalSources = [
    ...(showTemporaryFree ? fareCell.sources : []),
    ...(showOperator ? operatorCell.sources : []),
  ];
  const uniqueSources = operationalSources.filter(
    (s, i, arr) => arr.findIndex((x) => x.url === s.url) === i,
  );

  // FAQ q4: 가시 <dl> 만 조건부. FAQPage JSON-LD 는 만들지 않는다.
  const operationalScopeAnswer = showTemporaryFree
    ? t('routeDetail.aeo.a4TemporaryFree')
    : needsFareReverification
      ? t('routeDetail.aeo.a4Reverification')
      : t('routeDetail.aeo.a4scope');

  const statusKeyByLevel = {
    kakao_seoul_verified: 'verified',
    official_confirmed: 'officialConfirmed',
    official_pending: 'officialPending',
    community_reported: 'communityReported',
  } as const;
  const statusKey = statusKeyByLevel[route.verificationLevel] ?? 'verified';

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
            <span>{t(`status.${statusKey}`)}</span>
          </Pill>
        </div>
      </div>

      {/* Title */}
      <div className={styles.titleSection}>
        <h1 className={styles.heading}>{name}</h1>
        <div className={styles.subName}>{subName}</div>
        <div className={styles.checkedDate}>
          {`${t('routeDetail.info.verified')} ${formatDate(route.lastChecked, isKo)}`}
        </div>
        <div className={styles.disclaimer}>
          {t('routeDetail.disclaimer')}
        </div>
      </div>

      {/* Route context */}
      <section
        className={styles.contextSection}
        aria-labelledby="route-context-title"
      >
        <h2 id="route-context-title">{t('routeDetail.context.title')}</h2>
        <p className={styles.contextBody}>{context.overview}</p>
        <p className={styles.contextBody}>{context.useCase}</p>
      </section>

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
                  stops={displayStops}
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

              {(showTemporaryFree || showOperator) && (
                <dl className={styles.opsList}>
                  {showTemporaryFree && (
                    <div className={styles.opsRow}>
                      <dt className={styles.opsLabel}>{t('routeDetail.operational.fare')}</dt>
                      <dd className={styles.opsValue}>
                        {t('routeDetail.operational.temporaryFree')}
                        {fareValue?.kind === 'temporary_free' && fareValue.cardTagRequired && (
                          <span className={styles.opsNote}>
                            {t('routeDetail.operational.cardTagRequired')}
                          </span>
                        )}
                      </dd>
                    </div>
                  )}
                  {showOperator && (
                    <div className={styles.opsRow}>
                      <dt className={styles.opsLabel}>{t('routeDetail.operational.operator')}</dt>
                      <dd className={styles.opsValue}>
                        {operatorCell.value?.entities.map((e) => e.name).join(', ')}
                      </dd>
                    </div>
                  )}
                  {uniqueSources.length > 0 && (
                    <div className={styles.opsSource}>
                      {uniqueSources.map((s) => (
                        <a
                          key={s.url}
                          className={styles.opsSourceLink}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {`${t('routeDetail.operational.sourcePrefix')}: ${s.publisher} · ${formatSourceDate(s.publishedAt)}`}
                        </a>
                      ))}
                    </div>
                  )}
                </dl>
              )}

              {needsFareReverification && (
                <p className={styles.opsReverification}>
                  {t('routeDetail.operational.fareReverification')}
                </p>
              )}

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
              {route.firstBus === route.lastBus
                ? t('routeDetail.aeo.a2Single', { firstBus: route.firstBus })
                : t('routeDetail.aeo.a2', { firstBus: route.firstBus, lastBus: route.lastBus })}
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
            <dd className={styles.aeoA}>{operationalScopeAnswer}</dd>
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

      {/* A21 → 심야버스 전체 노선도 CTA (ko만) */}
      {route.id === 'simya-a21' && locale === 'ko' && (
        <div className={styles.nightBusCta}>
          <p className={styles.nightBusCtaText}>
            A21과 올빼미버스 환승 지점을 함께 보려면 서울 심야버스 전체 노선도를 확인하세요.
          </p>
          <Link href="/night-bus-map" className={styles.nightBusCtaLink}>
            서울 심야버스 전체 노선도 보기 →
          </Link>
        </div>
      )}

      <SiteFooter />
    </PageContainer>
  );
}
