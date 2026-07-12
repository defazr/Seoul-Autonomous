import { getTranslations } from 'next-intl/server';
import { routing } from '../../../../i18n/routing';
import { getEarlyMorningRoutes } from '../../../../lib/routes';
import { RouteCard } from '../../../../components/ui/RouteCard';
import { PageTopBar } from '../../../../components/ui/PageTopBar';
import { SiteFooter } from '../../../../components/common/SiteFooter';
import { PageContainer } from '../../../../components/layout/PageContainer';
import { breadcrumbJsonLd } from '../../../../lib/seo/jsonld';
import { buildPageMetadata } from '../../../../lib/seo/metadata';
import { Link } from '../../../../i18n/navigation';
import styles from './page.module.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'routeGroups.earlyMorning' });
  return buildPageMetadata({
    locale,
    path: '/routes/early-morning',
    title: t('title'),
    description: t('description'),
  });
}

export default async function EarlyMorningPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'routeGroups.earlyMorning' });
  const ts = await getTranslations({ locale, namespace: 'status' });
  const tc = await getTranslations({ locale, namespace: 'routeDetail' });
  const routes = getEarlyMorningRoutes();

  return (
    <PageContainer width="default">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              [
                { name: 'Home', path: '' },
                { name: 'Routes', path: '/routes' },
                { name: t('title'), path: '/routes/early-morning' },
              ],
              locale,
            ),
          ),
        }}
      />

      <PageTopBar
        href="/routes"
        ariaLabel={locale === 'ko' ? '전체 노선으로 돌아가기' : 'Back to all routes'}
      />
      <div className={styles.header}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.intro}>{t('intro')}</p>
      </div>

      <div className={styles.grid}>
        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            locale={locale}
          />
        ))}
      </div>

      <div className={styles.disclaimer}>
        {tc('disclaimer')}
      </div>

      <div className={styles.links}>
        <Link href="/how-to-ride" className={styles.crossLink}>
          {locale === 'ko' ? '이용 방법 보기 →' : 'How to ride →'}
        </Link>
        <Link href="/routes" className={styles.crossLink}>
          {locale === 'ko' ? '전체 노선 보기 →' : 'View all routes →'}
        </Link>
      </div>

      <SiteFooter />
    </PageContainer>
  );
}
