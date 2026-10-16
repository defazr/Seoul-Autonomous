import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '../../../i18n/routing';
import { Link } from '../../../i18n/navigation';
import { BulletRow } from '../../../components/how-to-ride/BulletRow';
import { NIGHT_META } from '../../../lib/night-bus/data';
import { getLatestVerifiedDate } from '../../../lib/routes';
import { Crumbs } from '../../../components/v2/ui/Crumbs';
import { PageHero } from '../../../components/v2/ui/PageHero';
import { Section } from '../../../components/v2/ui/Section';
import { breadcrumbJsonLd } from '../../../lib/seo/jsonld';
import { buildPageMetadata } from '../../../lib/seo/metadata';
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
    path: '/data-source',
    title: t('dataSourceTitle'),
    description: t('dataSourceDescription'),
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

export default async function DataSourcePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale); // 정적 프리렌더(next-intl) — 배포 전 점검 10-16
  const t = await getTranslations({ locale });
  const tp = await getTranslations({ locale, namespace: 'pages' });

  // 필드별 출처(V6) — 날짜는 SSoT _meta 와 노선 확인일에서 넣는다
  const rows: { key: string; url?: string; date?: string }[] = [
    { key: 'stops', url: NIGHT_META.stopsSource.url, date: NIGHT_META.stopsSource.snapshot },
    { key: 'schedule', url: NIGHT_META.scheduleSource.url, date: NIGHT_META.scheduleSource.revisedOn },
    { key: 'map' },
    { key: 'hubs', date: NIGHT_META.stopsSource.snapshot },
    { key: 'auto', date: getLatestVerifiedDate() },
    { key: 'stopNames' },
    { key: 'fare' },
    { key: 'tiles' },
    { key: 'arrivals' },
  ];

  const verification = [
    t('dataSource.verification.item1'),
    t('dataSource.verification.item2'),
    t('dataSource.verification.item3'),
    t('dataSource.verification.item4'),
    t('dataSource.verification.item5'),
  ];

  const accuracy = [
    t('dataSource.accuracy.item1'),
    t('dataSource.accuracy.item2'),
    t('dataSource.accuracy.item3'),
    t('dataSource.accuracy.item4'),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: t('dataSource.title'), path: '/data-source' }], locale)) }}
      />

      {/* Header */}
      <PageHero eyebrow={tp('dataSource.eyebrow')} title={t('dataSource.title')} lead={t('dataSource.intro')} crumbs={<Crumbs label={tp('crumbs')} items={[{ href: '/', label: t('shell.nav.home') }, { label: t('dataSource.title') }]} />} />
      <Section size="tight" width="text" ariaLabel={t('dataSource.title')}>
      {/* Section 1: 필드별 출처 */}
      <div className={styles.section}>
        <h2 className={styles.h2}>{t('dataSource.fieldsTitle')}</h2>
        <dl className={styles.rows}>
          {rows.map((r) => (
            <div key={r.key} className={styles.row}>
              <dt>{t(`dataSource.fields.${r.key}.field`)}</dt>
              <dd><b>{t('dataSource.cols.source')}</b>{r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer">{t(`dataSource.fields.${r.key}.source`)}</a> : t(`dataSource.fields.${r.key}.source`)}</dd>
              <dd><b>{t('dataSource.cols.license')}</b>{t(`dataSource.fields.${r.key}.license`)}</dd>
              <dd><b>{t('dataSource.cols.asOf')}</b>{t(`dataSource.fields.${r.key}.asOf`, { date: r.date ?? '' })}</dd>
            </div>
          ))}
        </dl>
        {/* 정류장 영문명 fallback 안내 (출처 목록과 분리된 표시 정책 설명) */}
        <p className={styles.bodyText}>
          {t('dataSource.stopNameFallbackNote')}
        </p>
      </div>

      {/* Section 2: Verification */}
      <div className={styles.section}>
        <h2 className={styles.h2}>
          {t('dataSource.verification.sectionTitle')}
        </h2>
        <div className={styles.bulletCard}>
          {verification.map((text, i) => (
            <div
              key={i}
              className={`${styles.bulletRow} ${i < verification.length - 1 ? styles.bulletBorder : ''}`}
            >
              <BulletRow text={text} />
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Accuracy */}
      <div className={styles.section}>
        <h2 className={styles.h2}>
          {t('dataSource.accuracy.sectionTitle')}
        </h2>
        <div className={styles.bulletCard}>
          {accuracy.map((text, i) => (
            <div
              key={i}
              className={`${styles.bulletRow} ${i < accuracy.length - 1 ? styles.bulletBorder : ''}`}
            >
              <BulletRow text={text} />
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Last Checked */}
      <div className={styles.section}>
        <h2 className={styles.h2}>
          {t('dataSource.lastChecked.sectionTitle')}
        </h2>
        <p className={styles.bodyText}>
          {t('dataSource.lastChecked.body')}
        </p>
      </div>

      {/* About link */}
      <Link href="/about" className={styles.pageLink}>
        {t('dataSource.aboutLink')}
        <ArrowRight />
      </Link>
      </Section>
    </>
  );
}
