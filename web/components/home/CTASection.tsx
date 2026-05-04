import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '../ui/Button';
import styles from './CTASection.module.css';

export function CTASection() {
  const t = useTranslations('nav');
  const locale = useLocale();

  return (
    <section className={styles.section}>
      <div className={styles.row}>
        <Link href={`/${locale}/routes`}>
          <Button variant="secondary" size="md">
            {t('viewAllRoutes')}
          </Button>
        </Link>
        <Button variant="ghost" size="md">
          {t('howToRide')} →
        </Button>
      </div>
    </section>
  );
}
