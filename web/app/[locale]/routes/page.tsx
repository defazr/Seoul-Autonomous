import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getVerifiedRoutes, getOnDemandServices } from '../../../lib/routes';
import { toRouteItem, toRobotaxiItem } from '../../../lib/transit-items';
import { breadcrumbJsonLd } from '../../../lib/seo/jsonld';
import { buildPageMetadata } from '../../../lib/seo/metadata';
import { NIGHT_BUS_GUIDE_PATH } from '../../../lib/nav';
import { NextIntlClientProvider } from 'next-intl';
import { clientMessages } from '../../../lib/v2/client-messages';
import { RoutesList } from '../../../components/routes/RoutesList';
import { PageHero } from '../../../components/v2/ui/PageHero';
import { Section } from '../../../components/v2/ui/Section';
import { Crumbs } from '../../../components/v2/ui/Crumbs';
import { Card } from '../../../components/v2/ui/Card';
import { ButtonLink } from '../../../components/v2/ui/Button';
import { Link } from '../../../i18n/navigation';
import styles from './group.module.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return buildPageMetadata({ locale, path: '/routes', title: t('routesTitle'), description: t('routesDescription') });
}

export default async function RoutesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale); // 정적 프리렌더(next-intl) — 배포 전 점검 10-16
  const tRoutes = await getTranslations({ locale, namespace: 'routes' });
  const tm = await getTranslations({ locale, namespace: 'metadata' });
  const tp = await getTranslations({ locale, namespace: 'pages' });
  const ts = await getTranslations({ locale, namespace: 'shell' });
  const routeItems = getVerifiedRoutes().map(toRouteItem);
  const serviceItems = getOnDemandServices().map((svc) => toRobotaxiItem(svc, (start, end) => tRoutes('robotaxi.hoursWeekdayOvernight', { start, end })));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: 'Routes', path: '/routes' }], locale)) }} />
      <PageHero eyebrow={tp('routes.eyebrow')} title={tRoutes('title')} lead={tm('routesDescription')} crumbs={<Crumbs label={tp('crumbs')} items={[{ href: '/', label: ts('nav.home') }, { label: tRoutes('title') }]} />} />
      <Section size="tight" ariaLabel={tRoutes('title')}>
        <NextIntlClientProvider locale={locale} messages={await clientMessages(locale, ['routes'])}>
          <RoutesList routes={routeItems} services={serviceItems} locale={locale} />
        </NextIntlClientProvider>
      </Section>
      <Section size="tight" ariaLabel={tp('routes.nightTitle')}>
        <Card className={styles.banner}>
          <div>
            <h2 className={styles.bannerTitle}>{tp('routes.nightTitle')}</h2>
            <p className={styles.bannerText}>{tp('routes.nightText')}</p>
          </div>
          <div className={styles.bannerActions}>
            <ButtonLink href={NIGHT_BUS_GUIDE_PATH} variant="primary">{tp('routes.nightCta')}</ButtonLink>
            <Link href="/" className={styles.crossLink}>{tp('routes.home')} →</Link>
          </div>
        </Card>
      </Section>
    </>
  );
}
