import { getTranslations } from 'next-intl/server';
import { routing } from '../../../i18n/routing';
import { Link } from '../../../i18n/navigation';
import { getAllUpdates } from '../../../data/updates';
import { SiteFooter } from '../../../components/common/SiteFooter';
import { PageTopBar } from '../../../components/ui/PageTopBar';
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
  const t = await getTranslations({ locale, namespace: 'updates' });
  return buildPageMetadata({
    locale,
    path: '/updates',
    title: t('pageTitle'),
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
  const t = await getTranslations({ locale, namespace: 'updates' });
  const isKo = locale === 'ko';
  const allUpdates = getAllUpdates();
  const updates = allUpdates.filter(e => !e.customRender || locale === 'ko');

  return (
    <PageContainer width="longform">
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

      <PageTopBar
        href="/"
        ariaLabel={isKo ? '홈으로 돌아가기' : 'Back to home'}
      />
      <div className={styles.header}>
        <h1 className={styles.title}>{t('pageTitle')}</h1>
      </div>

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

      <SiteFooter />
    </PageContainer>
  );
}
