import { useTranslations, useLocale } from 'next-intl';
import { RouteCard } from '../ui/RouteCard';
import { getFeaturedRoutes } from '../../lib/routes';
import styles from './FeaturedRoutes.module.css';

export function FeaturedRoutes() {
  const t = useTranslations('home.featured');
  const locale = useLocale();
  const routes = getFeaturedRoutes();

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('title')}</h2>
        <span className={styles.seeAll}>{t('seeAll')}</span>
      </div>
      <div className={styles.list}>
        {routes.map((route) => (
          <RouteCard key={route.id} route={route} locale={locale} />
        ))}
      </div>
    </section>
  );
}
