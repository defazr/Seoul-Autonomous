import { getTranslations } from 'next-intl/server';
import { getVerifiedRoutes, getOnDemandServices } from '../../../lib/routes';
import type { RouteListItem, RobotaxiListItem } from '../../../lib/types/route';
import { breadcrumbJsonLd } from '../../../lib/seo/jsonld';
import { buildPageMetadata } from '../../../lib/seo/metadata';
import { RoutesList } from '../../../components/routes/RoutesList';
import { PageTopBar } from '../../../components/ui/PageTopBar';
import { SiteFooter } from '../../../components/common/SiteFooter';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Link } from '../../../i18n/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return buildPageMetadata({
    locale,
    path: '/routes',
    title: t('routesTitle'),
    description: t('routesDescription'),
  });
}

export default async function RoutesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const routes = getVerifiedRoutes();
  const services = getOnDemandServices();

  // 26-C2O: client boundary 를 넘는 데이터는 표시에 필요한 필드로만 좁힌다.
  // 운영정보·출처·조사 상태·정류장 배열은 서버에 남는다.
  const routeItems: RouteListItem[] = routes.map((route) => ({
    id: route.id,
    displayName: route.displayName,
    displayNameKo: route.displayNameKo,
    startPoint: route.startPoint,
    startPointKo: route.startPointKo,
    endPoint: route.endPoint,
    endPointKo: route.endPointKo,
    firstBus: route.firstBus,
    lastBus: route.lastBus,
    headway: route.headway,
  }));

  const tRoutes = await getTranslations({ locale, namespace: 'routes' });
  const serviceItems: RobotaxiListItem[] = services.map((svc) => {
    const fare = svc.fare.value;
    const hours = svc.operatingHours.value;
    const reservation = svc.reservationRequired.value;
    const app = svc.appRequired.value;
    // 카드 대표 공식 출처는 최신 관련 공식 발표(운영시간) 우선, 없으면 기존 fare 근거 유지.
    const source = svc.operatingHours.sources[0] ?? svc.fare.sources[0] ?? null;
    return {
      id: svc.id,
      displayName: svc.displayName,
      displayNameKo: svc.displayNameKo,
      serviceArea: svc.serviceArea,
      serviceAreaKo: svc.serviceAreaKo,
      verificationLevel: svc.verificationLevel,
      fareBands: fare && fare.kind === 'time_bands' ? fare.bands : null,
      operatorNames: svc.operator.value?.entities.map((e) => e.name) ?? [],
      reservation: reservation
        ? { mode: reservation.mode, appName: reservation.appName }
        : null,
      app: app?.required ? { appName: app.appName, purposes: app.purposes } : null,
      hoursText: hours
        ? tRoutes('robotaxi.hoursWeekdayOvernight', { start: hours.start, end: hours.end })
        : null,
      source: source
        ? {
            publisher: source.publisher,
            url: source.url,
            publishedAt: source.publishedAt,
            effectiveAt: source.effectiveAt,
          }
        : null,
    };
  });

  return (
    <PageContainer width="default">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: 'Routes', path: '/routes' }], locale)) }}
      />
      <PageTopBar
        href="/"
        ariaLabel={locale === 'ko' ? '홈으로 돌아가기' : 'Back to home'}
      />
      <RoutesList routes={routeItems} services={serviceItems} locale={locale} />

      {/* 심야버스 노선도 배너 (ko만) */}
      {locale === 'ko' && (
        <div style={{ margin: '32px 0', padding: '20px 24px', backgroundColor: 'var(--color-bg-2)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-lg)' }}>
          <Link href="/night-bus-map" style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-accent)', textDecoration: 'none' }}>
            서울 심야버스 전체 노선도 보기 →
          </Link>
          <p style={{ fontSize: 13, color: 'var(--color-fg-3)', margin: '8px 0 0' }}>
            올빼미버스와 자율주행 심야 노선을 한 화면에서 확인하세요.
          </p>
        </div>
      )}

      <SiteFooter />
    </PageContainer>
  );
}
