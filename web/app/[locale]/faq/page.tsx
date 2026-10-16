import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '../../../i18n/routing';
import { Link } from '../../../i18n/navigation';
import { FAQList } from '../../../components/faq/FAQList';
import { faqEn } from '../../../data/faq/faq.en';
import { faqKo } from '../../../data/faq/faq.ko';
import type { FAQDocument } from '../../../lib/types/faq';
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
    path: '/faq',
    title: t('faqTitle'),
    description: t('faqDescription'),
  });
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale); // 정적 프리렌더(next-intl) — 배포 전 점검 10-16
  const t = await getTranslations({ locale });
  const tp = await getTranslations({ locale, namespace: 'pages' });
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: t('faq.title'), path: '/faq' }], locale)) }}
      />

      <PageHero eyebrow={tp('faq.eyebrow')} title={t('faq.title')} lead={t('faq.intro')} crumbs={<Crumbs label={tp('crumbs')} items={[{ href: '/', label: t('shell.nav.home') }, { label: t('faq.title') }]} />} />
      <Section size="tight" width="text" ariaLabel={t('faq.title')}>
        <FAQList items={faqDoc.items} />

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
      </Section>
    </>
  );
}
