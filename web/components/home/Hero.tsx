import { useTranslations } from 'next-intl';
import { StatusDot } from '../ui/Pill';
import { Button } from '../ui/Button';
import { getVerifiedRoutes } from '../../lib/routes';
import styles from './Hero.module.css';

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function Hero() {
  const t = useTranslations('home.hero');
  const verifiedCount = getVerifiedRoutes().length;

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.badge}>
          <StatusDot color="var(--color-accent)" size={6} />
          <span className={styles.badgeText}>
            {t('badge', { count: verifiedCount })}
          </span>
        </div>

        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.description}>{t('description')}</p>

        <div className={styles.ctaRow}>
          <Button variant="primary" size="md" icon={<ArrowRight />}>
            {t('cta')}
          </Button>
        </div>
      </section>
    </>
  );
}
