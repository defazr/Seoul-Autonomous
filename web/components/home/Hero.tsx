import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { StatusDot } from '../ui/Pill';
import { Button } from '../ui/Button';
import { getVerifiedRoutes, getLatestVerifiedDate } from '../../lib/routes';
import styles from './Hero.module.css';

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function formatHeroDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function Hero() {
  const t = useTranslations('home.hero');
  const locale = useLocale();
  const verifiedCount = getVerifiedRoutes().length;
  const latestDate = getLatestVerifiedDate();

  return (
    <section className={styles.heroGrid}>
      <div className={styles.heroLeft}>
        <div className={styles.badge}>
          <StatusDot color="var(--color-accent)" size={6} />
          <span className={styles.badgeText}>
            {t('badge', { count: verifiedCount })}
          </span>
        </div>

        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.description}>{t('description')}</p>

        <div className={styles.ctaRow}>
          <Link href={`/${locale}/routes`}>
            <Button variant="primary" size="md" icon={<ArrowRight />}>
              {t('cta')}
            </Button>
          </Link>
        </div>
      </div>

      <div className={styles.heroRight}>
        <figure className={styles.heroFigure}>
          <img
            src="/images/hero-bus-night.webp"
            alt=""
            width={480}
            height={340}
            loading="eager"
          />
          <figcaption className={styles.heroCaption}>
            {`VERIFIED ${formatHeroDate(latestDate)} · INDEPENDENT GUIDE`}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
