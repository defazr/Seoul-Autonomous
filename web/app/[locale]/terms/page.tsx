import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '../../../i18n/routing';
import { LegalDocument } from '../../../components/legal/LegalDocument';
import termsEn from '../../../data/legal/terms.en';
import termsKo from '../../../data/legal/terms.ko';
import { Crumbs } from '../../../components/v2/ui/Crumbs';
import { PageHero } from '../../../components/v2/ui/PageHero';
import { Section } from '../../../components/v2/ui/Section';
import { breadcrumbJsonLd } from '../../../lib/seo/jsonld';
import { buildPageMetadata } from '../../../lib/seo/metadata';

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
    path: '/terms',
    title: t('termsTitle'),
    description: t('termsDescription'),
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale); // 정적 프리렌더(next-intl) — 배포 전 점검 10-16
  const t = await getTranslations({ locale });
  const tp = await getTranslations({ locale, namespace: 'pages' });
  const doc = locale === 'ko' ? termsKo : termsEn;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: doc.title, path: '/terms' }], locale)) }}
      />

      <PageHero eyebrow={tp('legal.eyebrow')} title={doc.title} crumbs={<Crumbs label={tp('crumbs')} items={[{ href: '/', label: t('shell.nav.home') }, { label: doc.title }]} />} />
      <Section size="tight" width="text" ariaLabel={doc.title}>
        <LegalDocument document={doc} locale={locale} />
      </Section>
    </>
  );
}
