import { getTranslations } from 'next-intl/server';
import { routing } from '../../../i18n/routing';
import { Link } from '../../../i18n/navigation';
import { FAQList } from '../../../components/faq/FAQList';
import { faqEn } from '../../../data/faq/faq.en';
import { faqKo } from '../../../data/faq/faq.ko';
import type { FAQDocument } from '../../../lib/types/faq';
import { SiteFooter } from '../../../components/common/SiteFooter';
import { PageContainer } from '../../../components/layout/PageContainer';
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
    path: '/faq',
    title: t('faqTitle'),
    description: t('faqDescription'),
  });
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={10} />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const faqDoc: FAQDocument = locale === 'ko' ? faqKo : faqEn;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqDoc.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <PageContainer width="longform">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: t('faq.title'), path: '/faq' }], locale)) }}
      />

      {/* TopBar */}
      <div className={styles.topBar}>
        <Link href="/" className={styles.backBtn}>
          <ChevronLeft />
        </Link>

      </div>

      {/* Header */}
      <h1 className={styles.heading}>{t('faq.title')}</h1>
      <p className={styles.intro}>{t('faq.intro')}</p>

      {/* FAQ List */}
      <div className={styles.section}>
        <FAQList items={faqDoc.items} />
      </div>

      {/* Cross-links */}
      <div className={styles.links}>
        <Link href="/how-to-ride" className={styles.pageLink}>
          {t('faq.howToRideLink')}
          <ArrowRight />
        </Link>
        <Link href="/data-source" className={styles.pageLink}>
          {t('faq.dataSourceLink')}
          <ArrowRight />
        </Link>
      </div>

      {/* Footer */}
      <SiteFooter />
    </PageContainer>
  );
}
