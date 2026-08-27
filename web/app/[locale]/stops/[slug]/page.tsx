import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { routing } from '../../../../i18n/routing';
import { Link } from '../../../../i18n/navigation';
import { PageContainer } from '../../../../components/layout/PageContainer';
import { SiteFooter } from '../../../../components/common/SiteFooter';
import { breadcrumbJsonLd } from '../../../../lib/seo/jsonld';
import { buildPageMetadata } from '../../../../lib/seo/metadata';
import { getOfficialStopNameEn, stopNamesSourceMeta } from '../../../../lib/stops';
import { getRouteById } from '../../../../lib/routes';
import { APPROVED_STOPS, getApprovedStopBySlug } from '../../../../lib/stop-pages';
import routesData from '../../../../data/routes.json';
import { buildGraph } from '../../../../lib/graph/graph-core.mjs';
import styles from './page.module.css';

// Stage 1 Stop 페이지의 모든 관계·순서·이웃은 Graph Core 파생이다 (routes.json 무수정).
// 페이지가 아는 리터럴은 승인 registry 의 stopId/slug 뿐이다.
const transitGraph = buildGraph(routesData);

type StopRouteCard = {
  routeId: string;
  routeName: string;
  seq: number;
  total: number;
  previousStopId: string | null;
  previousNameKo: string | null;
  nextStopId: string | null;
  nextNameKo: string | null;
  lastChecked: string;
};

type StopPageData = {
  stopId: string;
  nameKo: string;
  cards: StopRouteCard[];
  /** 노선별 다음 정류장의 stopId dedup 목록 (노선 표시 순서 보존) */
  nextUnion: { stopId: string; nameKo: string }[];
};

/**
 * 승인 Stop 하나의 표시 데이터를 Graph 에서 파생한다.
 * 계약 위반(등록된 stopId 가 SSOT 에 없음 / 노선당 정차가 1회가 아님)은 조용히
 * 빈 화면을 렌더하지 않고 즉시 실패시킨다 — 26-C3.1 과 같은 강도.
 */
function buildStopPageData(stopId: string): StopPageData {
  const stop = transitGraph.stopsById.get(stopId);
  if (!stop) {
    throw new Error(`Approved stop ${stopId} is not present in the transit graph`);
  }

  const visits = stop.visits;
  const routeIds = new Set(visits.map((visit) => visit.routeId));
  if (routeIds.size !== visits.length) {
    // 같은 노선이 이 정류장을 두 번 지나면 "노선별 위치" 카드가 노선 수와 어긋난다.
    // Stage 1 승인 7개는 노선당 1회 정차가 전제이므로 데이터 변화는 설계 재심사 사유다.
    throw new Error(
      `Approved stop ${stopId} is visited more than once by the same route (${visits.length} visits, ${routeIds.size} routes)`,
    );
  }

  const cards: StopRouteCard[] = visits.map((visit) => {
    const route = getRouteById(visit.routeId);
    if (!route) {
      throw new Error(`Stop ${stopId} references unknown route ${visit.routeId}`);
    }
    const graphRoute = transitGraph.routes.find((item) => item.routeId === visit.routeId);
    if (!graphRoute) {
      throw new Error(`Route ${visit.routeId} is missing from the transit graph`);
    }
    return {
      routeId: visit.routeId,
      routeName: route.displayName,
      seq: visit.seq,
      total: graphRoute.visits.length,
      previousStopId: visit.prev?.stopId ?? null,
      previousNameKo: visit.prev?.nameKo ?? null,
      nextStopId: visit.next?.stopId ?? null,
      nextNameKo: visit.next?.nameKo ?? null,
      lastChecked: route.lastChecked,
    };
  });

  const nextUnion: { stopId: string; nameKo: string }[] = [];
  for (const visit of visits) {
    const next = visit.next;
    if (!next) continue;
    if (nextUnion.some((item) => item.stopId === next.stopId)) continue;
    nextUnion.push({ stopId: next.stopId, nameKo: next.nameKo });
  }

  return { stopId, nameKo: stop.nameKo, cards, nextUnion };
}

/** 표시명 계약(26-C2E.1): 영문은 공식 SSOT 단독, 미스는 한국어명으로만 대체한다. */
function resolveStopName(stopId: string, nameKo: string, isKo: boolean): string {
  if (isKo) return nameKo;
  return getOfficialStopNameEn(stopId) ?? nameKo;
}

function resolveRouteName(routeId: string, fallback: string, isKo: boolean): string {
  const route = getRouteById(routeId);
  if (!route) return fallback;
  return isKo ? route.displayNameKo : route.displayName;
}

/** 노선명 나열. 한국어는 사이트 관례인 가운뎃점, 영어는 문장용 연결어. */
function joinNames(names: string[], isKo: boolean): string {
  if (isKo) return names.join(' · ');
  if (names.length <= 1) return names[0] ?? '';
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

function formatDate(iso: string, isKo: boolean): string {
  const [year, month, day] = iso.split('-');
  if (isKo) return `${year}.${month}.${day}`;
  const monthName = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ][Number(month) - 1];
  return `${monthName} ${Number(day)}, ${year}`;
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

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const stop of APPROVED_STOPS) {
      params.push({ locale, slug: stop.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const approved = getApprovedStopBySlug(slug);
  if (!approved) return {};

  const isKo = locale === 'ko';
  const data = buildStopPageData(approved.stopId);
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const name = resolveStopName(data.stopId, data.nameKo, isKo);
  const routes = joinNames(
    data.cards.map((card) => resolveRouteName(card.routeId, card.routeName, isKo)),
    isKo,
  );
  const nextStops = data.nextUnion
    .map((item) => resolveStopName(item.stopId, item.nameKo, isKo))
    .join(' · ');

  return buildPageMetadata({
    locale,
    path: `/stops/${approved.slug}`,
    title: t('stopDetailTitle', { name, ars: data.stopId }),
    description: t('stopDetailDescription', {
      name,
      ars: data.stopId,
      routes,
      nextStops,
    }),
  });
}

export default async function StopDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const approved = getApprovedStopBySlug(slug);

  // 승인 목록에 없는 slug 는 페이지를 만들지 않는다 (redirect 없음).
  if (!approved) {
    notFound();
  }

  const t = await getTranslations({ locale });
  const isKo = locale === 'ko';
  const data = buildStopPageData(approved.stopId);

  const primaryName = resolveStopName(data.stopId, data.nameKo, isKo);
  const officialNameEn = getOfficialStopNameEn(data.stopId);
  const secondaryName = isKo ? officialNameEn : data.nameKo;

  const routeNames = data.cards.map((card) =>
    resolveRouteName(card.routeId, card.routeName, isKo),
  );
  const nextUnionNames = data.nextUnion.map((item) =>
    resolveStopName(item.stopId, item.nameKo, isKo),
  );

  // provenance 는 계열별 확인일을 분리한다. 페이지 생성일이 아니라 각 SSOT 의 기준일이다.
  const stopNamesCheckedOn = stopNamesSourceMeta.collectedAt.slice(0, 10);
  const routeDataCheckedOn = data.cards.reduce(
    (latest, card) => (card.lastChecked > latest ? card.lastChecked : latest),
    data.cards[0].lastChecked,
  );

  return (
    <PageContainer width="default">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              [
                { name: 'Home', path: '' },
                {
                  name: `${primaryName} ${data.stopId}`,
                  path: `/stops/${approved.slug}`,
                },
              ],
              locale,
            ),
          ),
        }}
      />

      <div className={styles.topBar}>
        <Link href="/routes" className={styles.backBtn}>
          <ChevronLeft />
        </Link>
      </div>

      {/* Hero — 공식명 + ARS + 노선별 다음 정류장. 동명 방향쌍은 이 두 줄로 갈린다. */}
      <div className={styles.hero}>
        <h1 className={styles.heading}>{primaryName}</h1>
        {secondaryName && secondaryName !== primaryName ? (
          <div className={styles.subName}>{secondaryName}</div>
        ) : null}
        <div className={styles.arsLine}>
          <span className={styles.arsLabel}>{t('stopDetail.ars')}</span>
          <span className={styles.arsValue}>{data.stopId}</span>
        </div>
        {nextUnionNames.length > 0 ? (
          <p className={styles.nextLine}>
            <span className={styles.nextLabel}>
              {t('stopDetail.nextStops', { count: nextUnionNames.length })}
            </span>
            <span className={styles.nextValue}>{nextUnionNames.join(' · ')}</span>
          </p>
        ) : null}
      </div>

      {/* 경유 노선 + 구조 역할 문장 (설계 V절: 별도 H2 없이 한 섹션으로 통합) */}
      <section className={styles.section} aria-labelledby="stop-routes-title">
        <h2 id="stop-routes-title" className={styles.sectionTitle}>
          {t('stopDetail.routesTitle')}
        </h2>
        <div className={styles.chipRow}>
          {data.cards.map((card, index) => (
            <Link
              key={card.routeId}
              href={`/routes/${card.routeId}`}
              className={styles.routeChip}
            >
              {routeNames[index]}
            </Link>
          ))}
        </div>
        <p className={styles.sharedSentence}>
          {t('stopDetail.sharedSentence', {
            name: primaryName,
            ars: data.stopId,
            routes: joinNames(routeNames, isKo),
          })}
        </p>
      </section>

      {/* 노선별 위치 — 이전·다음 정류장은 텍스트만 (Stop↔Stop 링크 v1 제외) */}
      {data.cards.map((card, index) => (
        <section
          key={card.routeId}
          className={styles.routeCard}
          aria-labelledby={`stop-position-${card.routeId}`}
        >
          <h2 id={`stop-position-${card.routeId}`} className={styles.cardTitle}>
            {t('stopDetail.positionTitle', { route: routeNames[index] })}
          </h2>
          <p className={styles.cardPosition}>
            {t('stopDetail.positionValue', { seq: card.seq, total: card.total })}
          </p>
          <dl className={styles.neighborList}>
            {card.previousStopId && card.previousNameKo ? (
              <div className={styles.neighborRow}>
                <dt className={styles.neighborLabel}>{t('stopDetail.previousStop')}</dt>
                <dd className={styles.neighborValue}>
                  {resolveStopName(card.previousStopId, card.previousNameKo, isKo)}
                </dd>
              </div>
            ) : null}
            {card.nextStopId && card.nextNameKo ? (
              <div className={styles.neighborRow}>
                <dt className={styles.neighborLabel}>
                  {t('stopDetail.nextStops', { count: 1 })}
                </dt>
                <dd className={styles.neighborValue}>
                  {resolveStopName(card.nextStopId, card.nextNameKo, isKo)}
                </dd>
              </div>
            ) : null}
          </dl>
          <Link href={`/routes/${card.routeId}`} className={styles.cardLink}>
            {t('stopDetail.viewRoute', { route: routeNames[index] })}
          </Link>
        </section>
      ))}

      {/* provenance — 정류장명 계열과 노선 데이터 계열의 확인일을 분리 표기 */}
      <section className={styles.section} aria-labelledby="stop-provenance-title">
        <h2 id="stop-provenance-title" className={styles.sectionTitle}>
          {t('stopDetail.provenanceTitle')}
        </h2>
        <dl className={styles.provList}>
          <div className={styles.provRow}>
            <dt className={styles.provLabel}>{t('stopDetail.provenanceStopNames')}</dt>
            <dd className={styles.provValue}>
              <a
                className={styles.provLink}
                href={stopNamesSourceMeta.datasetUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {stopNamesSourceMeta.dataset}
              </a>
              <span className={styles.provDate}>
                {t('stopDetail.checkedOn', {
                  date: formatDate(stopNamesCheckedOn, isKo),
                })}
              </span>
            </dd>
          </div>
          <div className={styles.provRow}>
            <dt className={styles.provLabel}>{t('stopDetail.provenanceRouteData')}</dt>
            <dd className={styles.provValue}>
              <span className={styles.provDate}>
                {t('stopDetail.checkedOn', {
                  date: formatDate(routeDataCheckedOn, isKo),
                })}
              </span>
            </dd>
          </div>
        </dl>
        <p className={styles.disclaimer}>{t('routeDetail.disclaimer')}</p>
      </section>

      <Link href="/routes" className={styles.allRoutesLink}>
        <ChevronLeft />
        {t('nav.viewAllRoutes')}
      </Link>

      <SiteFooter />
    </PageContainer>
  );
}
