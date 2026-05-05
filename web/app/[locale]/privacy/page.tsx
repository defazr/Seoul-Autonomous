import { getTranslations } from 'next-intl/server';
import { routing } from '../../../i18n/routing';
import { Link } from '../../../i18n/navigation';
import { LangToggle } from '../../../components/ui/LangToggle';
import { LegalDocument } from '../../../components/legal/LegalDocument';
import privacyEn from '../../../data/legal/privacy.en';
import privacyKo from '../../../data/legal/privacy.ko';
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
    title: t('privacyTitle'),
    description: t('privacyDescription'),
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

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const doc = locale === 'ko' ? privacyKo : privacyEn;

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <Link href="/" className={styles.backBtn}>
          <ChevronLeft />
        </Link>
        <span className={styles.topTitle}>{doc.title}</span>
        <LangToggle />
      </div>

      <LegalDocument document={doc} locale={locale} />

      <div className={styles.footerNote}>
        <span className={styles.footerIcon}><InfoIcon /></span>
        <span className={styles.footerText}>{t('common.footer')}</span>
      </div>
    </div>
  );
}
