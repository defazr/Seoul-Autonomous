import { useTranslations } from 'next-intl';
import { Link } from '../../i18n/navigation';
import styles from './ValueSection.module.css';

const ITEMS = [
  { key: 'routes', href: '/routes' },
  { key: 'nightBus', href: '/night-bus-map' },
  { key: 'updates', href: '/updates' },
] as const;

export function ValueSection() {
  const t = useTranslations('home.value');

  return (
    <section className={styles.section} aria-labelledby="home-value-title">
      <h2 id="home-value-title" className={styles.title}>
        {t('title')}
      </h2>
      <p className={styles.intro}>{t('intro')}</p>
      <div className={styles.grid}>
        {ITEMS.map((item) => (
          <Link key={item.key} href={item.href} className={styles.card}>
            <span className={styles.cardTitle}>
              {t(`items.${item.key}.title`)}
            </span>
            <span className={styles.cardDesc}>
              {t(`items.${item.key}.description`)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
