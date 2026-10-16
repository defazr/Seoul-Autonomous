import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '../../../i18n/routing';
import { Link } from '../../../i18n/navigation';
import { getAllUpdates } from '../../../data/updates';
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
  const t = await getTranslations({ locale, namespace: 'updates' });
  return buildPageMetadata({
    locale,
    path: '/updates',
    title: (await getTranslations({ locale, namespace: 'metadata' }))('updatesTitle'), // '업데이트' 단독 제목 → 브랜드 접미 (SEO 감사 FIX 4)
    description: t('pageDescription'),
  });
}

function formatDate(dateStr: string, isKo: boolean): string {
  const d = new Date(dateStr + 'T00:00:00');
  if (isKo) {
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function UpdatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale); // 정적 프리렌더(next-intl) — 배포 전 점검 10-16
  const t = await getTranslations({ locale, namespace: 'updates' });
  const tp = await getTranslations({ locale, namespace: 'pages' });
  const ts = await getTranslations({ locale, namespace: 'shell' });
  const isKo = locale === 'ko';
  const allUpdates = getAllUpdates();
  const updates = allUpdates.filter(e => !e.customRender || locale === 'ko');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              [
                { name: 'Home', path: '' },
                { name: t('breadcrumb'), path: '/updates' },
              ],
              locale,
            ),
          ),
        }}
      />

      <PageHero eyebrow={tp('updates.eyebrow')} title={t('pageTitle')} lead={t('pageDescription')} crumbs={<Crumbs label={tp('crumbs')} items={[{ href: '/', label: ts('nav.home') }, { label: t('breadcrumb') }]} />} />
      <Section size="tight" width="text" ariaLabel={t('pageTitle')}>
      <div className={styles.list}>
        {updates.map((entry) => (
          <Link
            key={entry.slug}
            href={`/updates/${entry.slug}`}
            className={styles.item}
          >
            <span className={styles.date}>
              {formatDate(entry.date, isKo)}
            </span>
            <span className={styles.itemTitle}>
              {isKo ? entry.titleKo : entry.titleEn}
            </span>
            <span className={styles.summary}>
              {isKo ? entry.summaryKo : entry.summaryEn}
            </span>
          </Link>
        ))}
      </div>
      </Section>
    </>
  );
}
