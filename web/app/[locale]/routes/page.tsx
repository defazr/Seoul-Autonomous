import { getTranslations } from 'next-intl/server';
import { getVerifiedRoutes, getOnDemandServices } from '../../../lib/routes';
import { breadcrumbJsonLd } from '../../../lib/seo/jsonld';
import { RoutesList } from '../../../components/routes/RoutesList';
import { SiteFooter } from '../../../components/common/SiteFooter';
import { PageContainer } from '../../../components/layout/PageContainer';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('routesTitle'),
    description: t('routesDescription'),
  };
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
      <RoutesList routes={routes} services={services} locale={locale} />
      <SiteFooter />
    </PageContainer>
  );
}
