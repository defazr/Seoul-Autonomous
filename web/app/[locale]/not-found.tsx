import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '../../i18n/navigation';
import { NIGHT_BUS_GUIDE_PATH } from '../../lib/nav';
import styles from './not-found.module.css';

/** 404 — v2 셸 안에서 홈·노선도·노선 목록으로 이어주는 안내. 상태 코드는 notFound() 가 404 로 보낸다. */
export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'notFound' });
  return (
    <section className={`v2-wrap ${styles.wrap}`} aria-labelledby="nf-title">
      <p className="v2-eyebrow">404</p>
      <h1 id="nf-title" className={styles.title}>{t('title')}</h1>
      <p className={styles.lead}>{t('lead')}</p>
      <ul className={styles.links}>
        <li><Link href="/">{t('home')} →</Link></li>
        <li><Link href={NIGHT_BUS_GUIDE_PATH}>{t('map')} →</Link></li>
        <li><Link href="/routes">{t('routes')} →</Link></li>
      </ul>
    </section>
  );
}
