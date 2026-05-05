import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import styles from './SiteFooter.module.css';

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={12} cy={12} r={10} />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

export async function SiteFooter() {
  const locale = await getLocale();
  const tf = await getTranslations({ locale, namespace: 'siteFooter' });
  const tc = await getTranslations({ locale, namespace: 'common' });

  const links = [
    { href: `/${locale}/faq`, label: tf('faq') },
    { href: `/${locale}/how-to-ride`, label: tf('howToRide') },
    { href: `/${locale}/data-source`, label: tf('dataSource') },
    { href: `/${locale}/about`, label: tf('about') },
    { href: `/${locale}/privacy`, label: tf('privacy') },
    { href: `/${locale}/terms`, label: tf('terms') },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={styles.link}>
            {l.label}
          </Link>
        ))}
      </div>
      <div className={styles.note}>
        <span className={styles.noteIcon}>
          <InfoIcon />
        </span>
        <span className={styles.noteText}>{tc('footer')}</span>
      </div>
    </footer>
  );
}
