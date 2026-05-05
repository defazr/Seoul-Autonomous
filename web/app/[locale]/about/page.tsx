import { getTranslations } from 'next-intl/server';
import { routing } from '../../../i18n/routing';
import { Link } from '../../../i18n/navigation';
import { LangToggle } from '../../../components/ui/LangToggle';
import { SiteFooter } from '../../../components/common/SiteFooter';
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
    title: t('aboutTitle'),
    description: t('aboutDescription'),
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: t('about.title'), path: '/about' }], locale)) }}
      />
      {/* TopBar */}
      <div className={styles.topBar}>
        <Link href="/" className={styles.backBtn}>
          <ChevronLeft />
        </Link>
        <Link href="/" className={styles.topTitle}>{t('about.title')}</Link>
        <LangToggle />
      </div>

      {/* Header */}
      <h1 className={styles.heading}>{t('about.title')}</h1>
      <p className={styles.intro}>{t('about.intro')}</p>

      {/* Section 1: Purpose */}
      <div className={styles.section}>
        <h2 className={styles.h2}>{t('about.purpose.sectionTitle')}</h2>
        <p className={styles.bodyText}>{t('about.purpose.body1')}</p>
        <p className={styles.bodyText}>{t('about.purpose.body2')}</p>
        <p className={styles.noteText}>{t('about.purpose.note')}</p>
      </div>

      {/* Section 2: Data Policy */}
      <div className={styles.section}>
        <h2 className={styles.h2}>{t('about.dataPolicy.sectionTitle')}</h2>
        <p className={styles.bodyText}>{t('about.dataPolicy.body')}</p>
        <Link href="/data-source" className={styles.pageLink}>
          {t('about.dataPolicy.linkLabel')}
          <ArrowRight />
        </Link>
      </div>

      {/* Section 3: Verification */}
      <div className={styles.section}>
        <h2 className={styles.h2}>{t('about.verification.sectionTitle')}</h2>
        <p className={styles.bodyText}>{t('about.verification.body')}</p>
      </div>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
