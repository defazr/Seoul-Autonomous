import { getTranslations } from 'next-intl/server';
import { routing } from '../../../i18n/routing';
import { Link } from '../../../i18n/navigation';
import { LangToggle } from '../../../components/ui/LangToggle';
import { LegalDocument } from '../../../components/legal/LegalDocument';
import termsEn from '../../../data/legal/terms.en';
import termsKo from '../../../data/legal/terms.ko';
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
    title: t('termsTitle'),
    description: t('termsDescription'),
  };
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6" />
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

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const doc = locale === 'ko' ? termsKo : termsEn;

  return (
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: doc.title, path: '/terms' }], locale)) }}
      />
      <div className={styles.topBar}>
        <Link href="/" className={styles.backBtn}>
          <ChevronLeft />
        </Link>
        <span className={styles.topTitle}>{doc.title}</span>
        <LangToggle />
      </div>

      <LegalDocument document={doc} locale={locale} />

      <SiteFooter />
    </div>
  );
}
