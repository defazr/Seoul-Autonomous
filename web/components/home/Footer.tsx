import { useTranslations } from 'next-intl';
import styles from './Footer.module.css';

function SensorIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="var(--color-fg-4)" strokeWidth={1.8}>
      <circle cx={12} cy={12} r={9} />
      <circle cx={12} cy={12} r={5} />
      <circle cx={12} cy={12} r={1.5} fill="var(--color-fg-4)" />
    </svg>
  );
}

export function Footer() {
  const t = useTranslations('home.footer');

  return (
    <footer className={styles.footer}>
      <SensorIcon />
      <p className={styles.text}>{t('note')}</p>
    </footer>
  );
}
