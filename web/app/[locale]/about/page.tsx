import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '../../../i18n/routing';
import { Link } from '../../../i18n/navigation';
import { Crumbs } from '../../../components/v2/ui/Crumbs';
import { PageHero } from '../../../components/v2/ui/PageHero';
import { Section } from '../../../components/v2/ui/Section';
import { breadcrumbJsonLd } from '../../../lib/seo/jsonld';
import { buildPageMetadata } from '../../../lib/seo/metadata';
import { NIGHT_META } from '../../../lib/night-bus/data';
import { getLatestVerifiedDate } from '../../../lib/routes';
import { CONTACT_MAIL } from '../../../components/v2/shell/Footer';
import styles from './page.module.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return buildPageMetadata({
    locale,
    path: '/about',
    title: t('aboutTitle'),
    description: t('aboutDescription'),
  });
}

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={14}
      height={14}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
     aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale); // 정적 프리렌더(next-intl) — 배포 전 점검 10-16
  const t = await getTranslations({ locale });
  const tp = await getTranslations({ locale, namespace: 'pages' });
  const dates = { stops: NIGHT_META.stopsSource.snapshot, schedule: NIGHT_META.scheduleSource.revisedOn, auto: getLatestVerifiedDate() };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: t('about.title'), path: '/about' }], locale)) }}
      />

      <PageHero eyebrow={tp('about.eyebrow')} title={t('about.title')} lead={t('about.intro')} crumbs={<Crumbs label={tp('crumbs')} items={[{ href: '/', label: t('shell.nav.home') }, { label: t('about.title') }]} />} />
      <Section size="tight" width="text" ariaLabel={t('about.title')}>
      {/* 신뢰층(V6): 운영자 → 목적 → 방법 → 이력 · 제보 */}
      <div className={styles.card}>
        <h2 className={styles.h2}>{t('about.who.title')}</h2>
        <p className={styles.bodyText}>{t('about.who.body1')}</p>
        <p className={styles.bodyText}>{t('about.who.body2')}</p>
        <p className={styles.contact}><span>{t('about.who.contact')}</span><a href={`mailto:${CONTACT_MAIL}?subject=${encodeURIComponent(t('about.report.subject'))}`}>{CONTACT_MAIL}</a></p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.h2}>{t('about.why.title')}</h2>
        <p className={styles.bodyText}>{t('about.why.body1')}</p>
        <p className={styles.bodyText}>{t('about.why.body2')}</p>
        <p className={styles.noteText}>{t('about.why.body3')}</p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.h2}>{t('about.how.title')}</h2>
        <ul className={styles.list}>
          {[1, 2, 3, 4, 5, 6].map((i) => <li key={i}>{t(`about.how.item${i}`, dates)}</li>)}
        </ul>
        <Link href="/data-source" className={styles.pageLink}>
          {t('about.how.link')}
          <ArrowRight />
        </Link>
      </div>

      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <h2 className={styles.h2}>{t('about.updates.title')}</h2>
          <p className={styles.bodyText}>{t('about.updates.body')}</p>
          <Link href="/updates" className={styles.pageLink}>
            {t('about.updates.link')}
            <ArrowRight />
          </Link>
        </div>
        <div className={styles.card}>
          <h2 className={styles.h2}>{t('about.report.title')}</h2>
          <p className={styles.bodyText}>{t('about.report.body')}</p>
          <a href={`mailto:${CONTACT_MAIL}?subject=${encodeURIComponent(t('about.report.subject'))}`} className={styles.pageLink}>{CONTACT_MAIL}</a>
        </div>
      </div>
      </Section>
    </>
  );
}
