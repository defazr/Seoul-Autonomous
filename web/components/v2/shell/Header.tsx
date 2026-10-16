import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '../../../i18n/navigation';
import { NIGHT_BUS_GUIDE_PATH } from '../../../lib/nav';
import { NavLinks } from './NavLinks';
import { LangToggle } from './LangToggle';
import { MobileMenu, type NavGroup } from './MobileMenu';
import styles from './Shell.module.css';

/** v2 셸 헤더 — 브랜드 + 태그라인 "서울 심야 이동 안내", 데스크톱 내비 5, 언어 전환, 모바일 시트 메뉴. */
export async function Header() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'shell' });
  const ko = locale === 'ko';

  const primary = [
    { href: NIGHT_BUS_GUIDE_PATH, label: t('nav.map') },
    { href: '/routes', label: t('nav.routes') },
    { href: '/how-to-ride', label: t('nav.howToRide') },
    { href: '/faq', label: t('nav.faq') },
    { href: '/updates', label: t('nav.updates') },
  ];
  const groups: NavGroup[] = [
    { title: t('groups.guide'), items: [{ href: '/', label: t('nav.home') }, ...primary] },
    ...(ko ? [{ title: t('groups.night'), items: [{ href: '/night-bus-fare', label: t('nav.fare') }, { href: '/after-last-train', label: t('nav.afterLastTrain') }] }] : []),
    { title: t('groups.site'), items: [{ href: '/about', label: t('nav.about') }, { href: '/data-source', label: t('nav.dataSource') }, { href: '/privacy', label: t('nav.privacy') }, { href: '/terms', label: t('nav.terms') }] },
  ];

  return (
    <header className={styles.header}>
      <div className={`v2-wrap ${styles.bar}`}>
        <Link href="/" className={styles.brand} aria-label={`Seoul Autonomous — ${t('tagline')}`}>
          <span className={styles.mark} aria-hidden="true" />
          <span>Seoul Autonomous</span>
          <span className={styles.tagline}>{t('tagline')}</span>
        </Link>
        <NavLinks items={primary} label={t('navLabel')} />
        <div className={styles.actions}>
          <LangToggle enGuideTitle={t('enGuideTitle')} label={t('language')} />
          <MobileMenu groups={groups} labels={{ open: t('menuOpen'), close: t('menuClose'), title: t('menuTitle'), language: t('language'), enGuideTitle: t('enGuideTitle') }} />
        </div>
      </div>
    </header>
  );
}
