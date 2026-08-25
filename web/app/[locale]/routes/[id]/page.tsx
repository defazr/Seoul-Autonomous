import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getVerifiedRoutes, getRouteById } from '../../../../lib/routes';
import { routeContextKo } from '../../../../data/route-context/route-context.ko';
import { routeContextEn } from '../../../../data/route-context/route-context.en';
import type { VerifiedRouteId } from '../../../../lib/types/route-context';
import type { Stop } from '../../../../lib/types/route';
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
import routesData from '../../../../data/routes.json';
import { buildGraph } from '../../../../lib/graph/graph-core.mjs';
import styles from './page.module.css';

// Phase 1B: shared-stop 관계는 Graph Core 파생으로만 계산한다 (routes.json 무수정).
// 모듈 로드 시 1회 파생하며, 입력 구조 위반은 GraphInputError 로 즉시 실패한다.
const transitGraph = buildGraph(routesData);

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

  // 26-C3: 노선 사실은 stop 배열에서만 파생한다. startPoint/endPoint 는 쓰지 않는다.
  // 26-C3.1: 계약 위반은 조건 없이 즉시 실패시킨다 (빈 답변을 조용히 렌더하지 않는다).
  if (stops.length === 0) {
    throw new Error(`Route ${route.id} has no stops`);
  }
  const turnaroundStops = stops.filter((stop) => stop.isTurnaround === true);
  if (turnaroundStops.length !== 1) {
    throw new Error(
      `Route ${route.id} must have exactly one turnaround stop, found ${turnaroundStops.length}`,
    );
  }
  const firstStop = stops[0];
  const turnaroundStop = turnaroundStops[0];
  const lastStop = stops[stops.length - 1];

  /** FAQ·주요 정류장·노선 사실이 공유하는 단일 표시명 resolver */
  const resolveStopName = (stop: Stop) =>
    isKo ? stop.nameKo : (getOfficialStopNameEn(stop.stopId) ?? stop.nameKo);

  const contextStops = context.keyStopIds.map((stopId) => {
    const stop = stops.find((item) => item.stopId === stopId);
    if (!stop) {
      throw new Error(`Route context stop ${stopId} is not part of ${route.id}`);
    }
    return { stopId, name: resolveStopName(stop) };
  });

  // 26-C3: FAQ q1 은 노선 id 가 아니라 stop 배열 구조로만 분기한다.
  const routeShape: 'sameStop' | 'sameNameReturn' | 'distinctTerminal' =
    firstStop.stopId === lastStop.stopId
      ? 'sameStop'
      : firstStop.nameKo === lastStop.nameKo
        ? 'sameNameReturn'
        : 'distinctTerminal';

  const boardingAnswer =
    routeShape === 'sameStop'
      ? t('routeDetail.aeo.a1SameStop', {
          first: resolveStopName(firstStop),
          turnaround: resolveStopName(turnaroundStop),
        })
      : routeShape === 'sameNameReturn'
        ? t('routeDetail.aeo.a1SameNameReturn', {
            first: resolveStopName(firstStop),
            turnaround: resolveStopName(turnaroundStop),
            last: resolveStopName(lastStop),
          })
        : t('routeDetail.aeo.a1DistinctTerminal', {
            first: resolveStopName(firstStop),
            turnaround: resolveStopName(turnaroundStop),
            last: resolveStopName(lastStop),
          });

  // Phase 1B vertical slice: shared-stop UI 는 A21 에만 노출한다
  // (아래 심야버스 CTA 와 동일 수준의 route.id 게이트 — 전 노선 확대는 별도 승인 단계).
  const showSharedStops = route.id === 'simya-a21';
  // stopId → 이 정류장을 지나는 다른 fixed route. Stop 층 routeIds(Set) 기준이라
  // 같은 노선의 반복 occurrence 가 노선 수를 부풀리지 않는다.
  const otherRoutesByStopId = new Map<string, { routeId: string; name: string }[]>();
  if (showSharedStops) {
    const graphRoute = transitGraph.routes.find((r) => r.routeId === route.id);
    for (const visit of graphRoute?.visits ?? []) {
      if (otherRoutesByStopId.has(visit.stopId)) continue;
      const stopNode = transitGraph.stopsById.get(visit.stopId);
      const otherIds = [...(stopNode?.routeIds ?? [])].filter((rid) => rid !== route.id);
      if (otherIds.length === 0) continue;
      otherRoutesByStopId.set(
        visit.stopId,
        otherIds.map((rid) => {
          const other = getRouteById(rid);
          return {
            routeId: rid,
            name: other ? (isKo ? other.displayNameKo : other.displayName) : rid,
          };
        }),
      );
    }
  }
  // 요약 1줄: 닫힌 <details> 미리보기 3곳(첫·반환점·마지막)이 전부 비공유일 수 있어
  // 기능 발견성은 이 줄이 담당한다. 수치·노선 목록 전부 Graph 계산에서 파생 (하드코딩 금지).
  const connectedRoutes: { routeId: string; name: string }[] = [];
  for (const list of otherRoutesByStopId.values()) {
    for (const other of list) {
      if (!connectedRoutes.some((c) => c.routeId === other.routeId)) {
        connectedRoutes.push(other);
      }
    }
  }
  const sharedSummary =
    showSharedStops && otherRoutesByStopId.size > 0
      ? {
          text: t('routeDetail.stops.sharedStopsSummary', {
            count: otherRoutesByStopId.size,
          }),
          routes: connectedRoutes,
        }
      : undefined;

  // 26-C2E: 표시명 해결은 서버에서 끝낸다 (SSOT 는 client bundle 로 나가지 않는다).
  // 보조줄 노출 여부는 StopsList 가 렌더 문맥(미리보기/전체)에 따라 결정한다.
  // 26-C2E.1: 영문 표시명의 유일한 출처는 공식 SSOT 다. 미스는 한국어명으로만 대체한다
  // (routes.json 의 legacy nameEn 은 표시 경로에서 사용하지 않는다).
  const displayStops = stops.map((stop) => {
    const otherRoutes = otherRoutesByStopId.get(stop.stopId);
    if (isKo) {
      return {
        seq: stop.seq,
        displayName: stop.nameKo,
        isTurnaround: stop.isTurnaround,
        ...(otherRoutes ? { otherRoutes } : {}),
      };
    }
    const officialNameEn = getOfficialStopNameEn(stop.stopId);
    return {
      seq: stop.seq,
      displayName: officialNameEn ?? stop.nameKo,
      secondaryName: officialNameEn ? stop.nameKo : undefined,
      isTurnaround: stop.isTurnaround,
      ...(otherRoutes ? { otherRoutes } : {}),
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

        <h3 className={styles.contextSubTitle}>
          {t('routeDetail.context.patternTitle')}
        </h3>
        <p className={styles.contextBody}>{context.routePattern}</p>

        <h3 className={styles.contextSubTitle}>
          {t('routeDetail.context.factsTitle')}
        </h3>
        <dl className={styles.factList}>
          <div className={styles.factRow}>
            <dt className={styles.factLabel}>
              {t('routeDetail.context.firstStop')}
            </dt>
            <dd className={styles.factValue}>{resolveStopName(firstStop)}</dd>
          </div>
          <div className={styles.factRow}>
            <dt className={styles.factLabel}>
              {t('routeDetail.context.turnaround')}
            </dt>
            <dd className={styles.factValue}>
              {resolveStopName(turnaroundStop)}
            </dd>
          </div>
          <div className={styles.factRow}>
            <dt className={styles.factLabel}>
              {t('routeDetail.context.lastStop')}
            </dt>
            <dd className={styles.factValue}>{resolveStopName(lastStop)}</dd>
          </div>
          <div className={styles.factRow}>
            <dt className={styles.factLabel}>
              {t('routeDetail.context.serviceHours')}
            </dt>
            <dd className={styles.factValue}>
              {formatHours(route.firstBus, route.lastBus)}
            </dd>
          </div>
        </dl>

        <h3 className={styles.contextSubTitle}>
          {t('routeDetail.context.keyStopsTitle')}
        </h3>
        <ul className={styles.keyStopList}>
          {contextStops.map((s) => (
            <li key={s.stopId} className={styles.keyStopItem}>
              {s.name}
            </li>
          ))}
        </ul>

        <h3 className={styles.contextSubTitle}>
          {t('routeDetail.context.useCaseTitle')}
        </h3>
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
                  {...(sharedSummary
                    ? {
                        sharedSummary,
                        otherRoutesLabel: t('routeDetail.stops.otherRoutes'),
                      }
                    : {})}
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
            <dd className={styles.aeoA}>{boardingAnswer}</dd>
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
