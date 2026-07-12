import { getTranslations } from 'next-intl/server';
import { getVerifiedRoutes, getOnDemandServices } from '../../../lib/routes';
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
      <RoutesList routes={routes} services={services} locale={locale} />

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
