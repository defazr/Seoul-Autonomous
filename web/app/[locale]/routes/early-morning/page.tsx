import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '../../../../i18n/routing';
import { getEarlyMorningRoutes } from '../../../../lib/routes';
import { toRouteItem } from '../../../../lib/transit-items';
import { RouteCard } from '../../../../components/v2/transit/RouteCard';
import { PageHero } from '../../../../components/v2/ui/PageHero';
import { Section } from '../../../../components/v2/ui/Section';
import { Crumbs } from '../../../../components/v2/ui/Crumbs';
import { breadcrumbJsonLd } from '../../../../lib/seo/jsonld';
import { buildPageMetadata } from '../../../../lib/seo/metadata';
import { Link } from '../../../../i18n/navigation';
import styles from '../group.module.css';

export function generateStaticParams() { return routing.locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'routeGroups.earlyMorning' });
  return buildPageMetadata({ locale, path: '/routes/early-morning', title: t('title'), description: t('description') });
}

export default async function EarlyMorningPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale); // 정적 프리렌더(next-intl) — 배포 전 점검 10-16
  const t = await getTranslations({ locale, namespace: 'routeGroups.earlyMorning' });
  const tc = await getTranslations({ locale, namespace: 'routeDetail' });
  const tr = await getTranslations({ locale, namespace: 'routes' });
  const tp = await getTranslations({ locale, namespace: 'pages' });
  const ts = await getTranslations({ locale, namespace: 'shell' });
  const routes = getEarlyMorningRoutes();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: 'Routes', path: '/routes' }, { name: t('title'), path: '/routes/early-morning' }], locale)) }} />
      <PageHero eyebrow={tp('group.eyebrow')} title={t('title')} lead={t('intro')} crumbs={<Crumbs label={tp('crumbs')} items={[{ href: '/', label: ts('nav.home') }, { href: '/routes', label: tr('title') }, { label: t('title') }]} />} />
      <Section size="tight" ariaLabel={t('title')}>
        <div className={styles.grid}>
          {routes.map((route) => <RouteCard key={route.id} route={toRouteItem(route)} locale={locale} />)}
        </div>
        <p className={styles.disclaimer}>{tc('disclaimer')}</p>
        <div className={styles.links}>
          <Link href="/how-to-ride" className={styles.crossLink}>{tp('routes.howTo')} →</Link>
          <Link href="/routes" className={styles.crossLink}>{tp('routes.all')} →</Link>
        </div>
      </Section>
    </>
  );
}
