import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { routing } from '../../../../i18n/routing';
import { Link } from '../../../../i18n/navigation';
import { getAllUpdates, getUpdateBySlug } from '../../../../data/updates';
import { getRouteById } from '../../../../lib/routes';
import { SiteFooter } from '../../../../components/common/SiteFooter';
import { PageContainer } from '../../../../components/layout/PageContainer';
import { breadcrumbJsonLd } from '../../../../lib/seo/jsonld';
import { buildPageMetadata } from '../../../../lib/seo/metadata';
import { NightBusMapLaunch, nightBusMapFaqJsonLd } from '../../../../components/updates/NightBusMapLaunch';
import styles from './page.module.css';

export function generateStaticParams() {
  const updates = getAllUpdates();
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const entry of updates) {
      // ko 전용 글은 en 경로 생성하지 않음
      if (entry.customRender && locale !== 'ko') continue;
      params.push({ locale, slug: entry.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const entry = getUpdateBySlug(slug);
  if (!entry) return {};
  // ko 전용 글 en 접근 시 404
  if (entry.customRender && locale !== 'ko') return {};

  // ko 전용 글은 hreflang ko self만 (en/x-default 제거)
  if (entry.customRender) {
    const { SITE_URL } = await import('../../../../lib/seo/config');
    const koUrl = `${SITE_URL}/ko/updates/${slug}`;
    return {
      title: entry.titleKo,
      description: entry.summaryKo,
      alternates: { canonical: koUrl },
      openGraph: {
        title: entry.titleKo,
        description: entry.summaryKo,
        url: koUrl,
        siteName: 'Seoul Autonomous',
        type: 'article' as const,
        locale: 'ko_KR',
        images: [{ url: `${SITE_URL}/og/night-bus-map-og.jpg`, width: 1200, height: 630, alt: '서울 심야버스 노선도' }],
      },
      twitter: {
        card: 'summary_large_image' as const,
        title: entry.titleKo,
        description: entry.summaryKo,
        images: [{ url: `${SITE_URL}/og/night-bus-map-og.jpg`, alt: '서울 심야버스 노선도' }],
      },
    };
  }

  return buildPageMetadata({
    locale,
    path: `/updates/${slug}`,
    title: locale === 'ko' ? entry.titleKo : entry.titleEn,
    description: locale === 'ko' ? entry.summaryKo : entry.summaryEn,
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

export default async function UpdateDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const entry = getUpdateBySlug(slug);

  if (!entry || (entry.customRender && locale !== 'ko')) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'updates' });
  const isKo = locale === 'ko';
  const title = isKo ? entry.titleKo : entry.titleEn;
  const s = entry.sections;

  // 전용 렌더 분기 (A안 — 껍데기 기존, 내용만 전용)
  if (entry.customRender === 'night-bus-map-launch') {
    return (
      <PageContainer width="longform">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: title,
              description: entry.summaryKo,
              datePublished: entry.date,
              dateModified: entry.dateModified ?? entry.date,
              author: { '@type': 'Organization', name: 'Seoul Autonomous' },
              image: 'https://seoulautonomous.com/images/updates/updates-night-bus-map-01-full.jpg',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(nightBusMapFaqJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              breadcrumbJsonLd(
                [
                  { name: 'Home', path: '' },
                  { name: t('breadcrumb'), path: '/updates' },
                  { name: title, path: `/updates/${entry.slug}` },
                ],
                locale,
              ),
            ),
          }}
        />
        <div className={styles.topBar}>
          <Link href="/updates" className={styles.backLink}>{t('backToUpdates')}</Link>
        </div>
        <h1 className={styles.heading}>{entry.h1Ko ?? title}</h1>
        <div className={styles.dates}>
          <span className={styles.dateMeta}>{isKo ? '게시' : 'Posted'} {formatDate(entry.date, isKo)}</span>
        </div>
        <div className={styles.body}>
          <NightBusMapLaunch />
        </div>
        <SiteFooter />
      </PageContainer>
    );
  }

  return (
    <PageContainer width="longform">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: title,
            datePublished: entry.date,
            dateModified: entry.date,
            author: {
              '@type': 'Organization',
              name: 'Seoul Autonomous',
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              [
                { name: 'Home', path: '' },
                { name: t('breadcrumb'), path: '/updates' },
                { name: title, path: `/updates/${entry.slug}` },
              ],
              locale,
            ),
          ),
        }}
      />

      <div className={styles.topBar}>
        <Link href="/updates" className={styles.backLink}>
          {t('backToUpdates')}
        </Link>
      </div>

      <h1 className={styles.heading}>{title}</h1>

      <div className={styles.dates}>
        <span className={styles.dateMeta}>
          {isKo ? '게시' : 'Posted'} {formatDate(entry.date, isKo)}
        </span>
        <span className={styles.dateSep}>·</span>
        <span className={styles.dateMeta}>
          {t('eventDate')} {formatDate(entry.eventDate, isKo)}
        </span>
        <span className={styles.dateSep}>·</span>
        <span className={styles.dateMeta}>
          {t('sourceDate')} {formatDate(entry.sourcePublishedAt, isKo)}
        </span>
      </div>

      {entry.relatedRouteIds.length > 0 && (
        <div className={styles.relatedRoutes}>
          <span className={styles.relatedLabel}>{t('relatedRoutes')}:</span>
          {entry.relatedRouteIds.map((id) => {
            const route = getRouteById(id);
            if (route) {
              return (
                <Link
                  key={id}
                  href={`/routes/${id}`}
                  className={styles.routeChip}
                >
                  {isKo ? route.displayNameKo : route.displayName}
                </Link>
              );
            }
            return (
              <span key={id} className={styles.routeChipInactive}>
                {id}
              </span>
            );
          })}
        </div>
      )}

      <div className={styles.body}>
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('whatChanged')}</h2>
          <p className={styles.paragraph}>
            {isKo ? s.whatChanged.ko : s.whatChanged.en}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>{t('confirmedInfo')}</h2>
          <ul className={styles.infoList}>
            {(isKo ? s.confirmedInfo.ko : s.confirmedInfo.en).map((item, i) => (
              <li key={i} className={styles.infoItem}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>{t('reportedInfo')}</h2>
          <ul className={styles.infoList}>
            {(isKo ? s.reportedInfo.ko : s.reportedInfo.en).map((item, i) => (
              <li key={i} className={styles.reportedItem}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>{t('checkBefore')}</h2>
          <p className={styles.paragraph}>
            {isKo ? s.checkBefore.ko : s.checkBefore.en}
          </p>
        </section>

        {entry.relatedRouteIds.map((id) => {
          const route = getRouteById(id);
          if (route) {
            return (
              <Link key={id} href={`/routes/${id}`} className={styles.viewRoute}>
                {t('viewRoute')}
              </Link>
            );
          }
          return null;
        })}
      </div>

      <SiteFooter />
    </PageContainer>
  );
}
