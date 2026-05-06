import { getTranslations } from 'next-intl/server';
import { routing } from '../../../i18n/routing';
import { Link } from '../../../i18n/navigation';
import { LangToggle } from '../../../components/ui/LangToggle';
import { BulletRow } from '../../../components/how-to-ride/BulletRow';
import { SiteFooter } from '../../../components/common/SiteFooter';
import { PageContainer } from '../../../components/layout/PageContainer';
import { breadcrumbJsonLd } from '../../../lib/seo/jsonld';
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
  return {
    title: t('dataSourceTitle'),
    description: t('dataSourceDescription'),
  };
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

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
    >
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
  const t = await getTranslations({ locale });

  const sources = [
    t('dataSource.sources.item1'),
    t('dataSource.sources.item2'),
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
    <PageContainer width="longform">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: t('dataSource.title'), path: '/data-source' }], locale)) }}
      />
      {/* TopBar */}
      <div className={styles.topBar}>
        <Link href="/" className={styles.backBtn}>
          <ChevronLeft />
        </Link>
        <Link href="/" className={styles.topTitle}>{t('dataSource.title')}</Link>
        <LangToggle />
      </div>

      {/* Header */}
      <h1 className={styles.heading}>{t('dataSource.title')}</h1>
      <p className={styles.intro}>{t('dataSource.intro')}</p>

      {/* Section 1: Sources */}
      <div className={styles.section}>
        <h2 className={styles.h2}>{t('dataSource.sources.sectionTitle')}</h2>
        <div className={styles.bulletCard}>
          {sources.map((text, i) => (
            <div
              key={i}
              className={`${styles.bulletRow} ${i < sources.length - 1 ? styles.bulletBorder : ''}`}
            >
              <BulletRow text={text} />
            </div>
          ))}
        </div>
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

      {/* Footer */}
      <SiteFooter />
    </PageContainer>
  );
}
