import { getLocale, getTranslations } from 'next-intl/server';
import { MobileDrawer } from './MobileDrawer';
import styles from './GlobalHeader.module.css';

function SensorIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="var(--color-accent)" strokeWidth={1.8}>
      <circle cx={12} cy={12} r={9} />
      <circle cx={12} cy={12} r={5} />
      <circle cx={12} cy={12} r={1.5} fill="var(--color-accent)" />
    </svg>
  );
}

export async function GlobalHeader() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'globalHeader' });

  const desktopLinks = [
    { href: `/${locale}/routes`, label: t('routes'), key: 'routes' },
    { href: `/${locale}/how-to-ride`, label: t('howToRide'), key: 'how-to-ride' },
    { href: `/${locale}/faq`, label: t('faq'), key: 'faq' },
  ];

  const drawerLinks = [
    { href: `/${locale}/routes`, label: t('routes') },
    { href: `/${locale}/how-to-ride`, label: t('howToRide') },
    { href: `/${locale}/faq`, label: t('faq') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/data-source`, label: t('dataSource') },
    { href: `/${locale}/privacy`, label: t('privacy') },
    { href: `/${locale}/terms`, label: t('terms') },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href={`/${locale}`} className={styles.logo}>
          <span className={styles.logoMark}>
            <SensorIcon />
          </span>
          <span className={styles.logoText}>Seoul Autonomous</span>
        </a>

        <nav className={styles.desktopNav}>
          {desktopLinks.map((link) => (
            <a key={link.key} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>

        <MobileDrawer
          links={drawerLinks}
          openLabel={t('menuOpen')}
          closeLabel={t('menuClose')}
        />
      </div>
    </header>
  );
}
