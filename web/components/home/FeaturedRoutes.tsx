import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { RouteCard } from '../ui/RouteCard';
import { getFeaturedRoutes } from '../../lib/routes';
import styles from './FeaturedRoutes.module.css';

export function FeaturedRoutes() {
  const t = useTranslations('home.featured');
  const ts = useTranslations('status');
  const locale = useLocale();
  const routes = getFeaturedRoutes();

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('title')}</h2>
        <Link href={`/${locale}/routes`} className={styles.seeAll}>{t('seeAll')}</Link>
      </div>
      <div className={styles.list}>
        {routes.map((route) => (
          <RouteCard key={route.id} route={route} locale={locale} verifiedLabel={ts('verified')} />
        ))}
      </div>
    </section>
  );
}
