import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '../../../i18n/navigation';
import { NIGHT_BUS_GUIDE_PATH } from '../../../lib/nav';
import { NIGHT_META } from '../../../lib/night-bus/data';
import { getLatestVerifiedDate } from '../../../lib/routes';
import styles from './Shell.module.css';

export const CONTACT_MAIL = 'seoulautonomous@protonmail.com';

/** v2 셸 푸터 — 안내 링크 3묶음 + 근거(기준일) + 제보 경로. 모든 페이지에서 운영자·출처·제보까지 1클릭. */
export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'shell' });
  const ko = locale === 'ko';
  const groups = [
    { title: t('groups.guide'), items: [{ href: '/', label: t('nav.home') }, { href: NIGHT_BUS_GUIDE_PATH, label: t('nav.map') }, { href: '/routes', label: t('nav.routes') }, { href: '/updates', label: t('nav.updates') }] },
    { title: t('groups.night'), items: [...(ko ? [{ href: '/night-bus-fare', label: t('nav.fare') }, { href: '/after-last-train', label: t('nav.afterLastTrain') }] : []), { href: '/how-to-ride', label: t('nav.howToRide') }, { href: '/faq', label: t('nav.faq') }] },
    { title: t('groups.site'), items: [{ href: '/about', label: t('nav.about') }, { href: '/data-source', label: t('nav.dataSource') }, { href: '/privacy', label: t('nav.privacy') }, { href: '/terms', label: t('nav.terms') }] },
  ];
  return (
    <footer className={styles.footer}>
      <div className="v2-wrap">
        <div className={styles.footTop}>
          <div className={styles.footBrand}>
            <span className={styles.brand}><span className={styles.mark} aria-hidden="true" />Seoul Autonomous</span>
            <p className={styles.footAbout}>{t('footer.about')}</p>
          </div>
          {groups.map((g) => (
            <nav key={g.title} className={styles.footGroup} aria-label={g.title}>
              <p className={styles.footH}>{g.title}</p>
              {g.items.map((it) => <Link key={it.href} href={it.href} className={styles.footLink}>{it.label}</Link>)}
            </nav>
          ))}
        </div>
        <div className={styles.footMeta}>
          <p><b>{t('footer.sources')}</b>{t('footer.sourceStops')} <span className={styles.mono}>{NIGHT_META.stopsSource.snapshot}</span> · {t('footer.sourceSchedule')} <span className={styles.mono}>{NIGHT_META.scheduleSource.revisedOn}</span> · {t('footer.sourceAuto')} <span className={styles.mono}>{getLatestVerifiedDate()}</span> · {t('footer.sourceMap')}</p>
          <p><b>{t('footer.report')}</b>{t('footer.reportText')} <a className={styles.footMail} href={`mailto:${CONTACT_MAIL}`}>{CONTACT_MAIL}</a></p>
        </div>
        <p className={styles.copy}>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
}
