import { getTranslations } from 'next-intl/server';
import { getVerifiedRoutes, getOnDemandServices } from '../../../lib/routes';
import { RoutesList } from '../../../components/routes/RoutesList';
import { SiteFooter } from '../../../components/common/SiteFooter';

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
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <RoutesList routes={routes} services={services} locale={locale} />
      <SiteFooter />
    </div>
  );
}
