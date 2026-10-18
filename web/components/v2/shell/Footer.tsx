import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { NIGHT_BUS_GUIDE_PATH } from '../../../lib/nav';
import { NIGHT_META } from '../../../lib/night-bus/data';
import { getLatestVerifiedDate } from '../../../lib/routes';
import styles from './Shell.module.css';

export const CONTACT_MAIL = 'seoulautonomous@protonmail.com';

/** v2 셸 푸터 — 안내 링크 3묶음 + 근거(기준일) + 제보 경로. 모든 페이지에서 운영자·출처·제보까지 1클릭. */
export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'shell' });
  return <FooterView locale={locale} t={(key) => t(key as Parameters<typeof t>[0])} />;
}

/** 요청 문맥 없이 그리는 푸터 본체 — 전역 404(app/not-found.tsx)가 en 메시지로 직접 쓴다.
 *  루트 not-found 는 모든 페이지 렌더에 함께 실행되므로 거기서는 getLocale()·setRequestLocale() 을 부를 수 없다(전 페이지가 동적이 되거나 로케일이 바뀜 · 10-18 실측).
 *  링크는 next/link + 로케일 접두사 수동 — next-intl 서버 Link 는 getLocale() 을 부른다. */
export function FooterView({ locale, t }: { locale: string; t: (key: string) => string }) {
  const ko = locale === 'ko';
  const href = (path: string) => `/${locale}${path === '/' ? '' : path}`;
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
              {g.items.map((it) => <Link key={it.href} href={href(it.href)} className={styles.footLink}>{it.label}</Link>)}
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
