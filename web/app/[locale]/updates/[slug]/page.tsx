import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '../../../../i18n/routing';
import { Link } from '../../../../i18n/navigation';
import { getAllUpdates, getUpdateBySlug } from '../../../../data/updates';
import { getOnDemandServices, getRouteById } from '../../../../lib/routes';
import { Crumbs } from '../../../../components/v2/ui/Crumbs';
import { PageHero } from '../../../../components/v2/ui/PageHero';
import { Section } from '../../../../components/v2/ui/Section';
import { breadcrumbJsonLd } from '../../../../lib/seo/jsonld';
import { buildPageMetadata } from '../../../../lib/seo/metadata';
import { koSpans } from '../../../../lib/v2/ko-spans';
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
export const dynamicParams = false; // 생성 목록 밖 경로(다른 로케일·없는 id)는 요청 시점 notFound() 대신 정적 전역 404 로 (R3b-4 · 2026-10-18)

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
    type: 'article',
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
  setRequestLocale(locale); // 정적 프리렌더(next-intl) — 배포 전 점검 10-16
  const entry = getUpdateBySlug(slug);

  if (!entry || (entry.customRender && locale !== 'ko')) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'updates' });
  const tp = await getTranslations({ locale, namespace: 'pages' });
  const ts = await getTranslations({ locale, namespace: 'shell' });
  const isKo = locale === 'ko';
  const title = isKo ? entry.titleKo : entry.titleEn;
  const s = entry.sections;

  // 전용 렌더 분기 (A안 — 껍데기 기존, 내용만 전용)
  if (entry.customRender === 'night-bus-map-launch') {
    return (
      <>
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
              publisher: { '@type': 'Organization', name: 'Seoul Autonomous', logo: { '@type': 'ImageObject', url: 'https://seoulautonomous.com/icon.png' } },
              mainEntityOfPage: `https://seoulautonomous.com/ko/updates/${entry.slug}`,
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
        <PageHero eyebrow={tp('updates.eyebrow')} title={entry.h1Ko ?? title} crumbs={<Crumbs label={tp('crumbs')} items={[{ href: '/', label: ts('nav.home') }, { href: '/updates', label: t('breadcrumb') }, { label: title }]} />}>
        <div className={styles.dates}>
          <span className={styles.dateMeta}>{isKo ? '게시' : 'Posted'} {formatDate(entry.date, isKo)}</span>
        </div>
        </PageHero>
        <Section size="tight" width="text" ariaLabel={entry.h1Ko ?? title}>
        <div className={styles.body}>
          <NightBusMapLaunch />
        </div>
      </Section>
      </>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: title,
            description: locale === 'ko' ? entry.summaryKo : entry.summaryEn,
            datePublished: entry.date,
            dateModified: entry.dateModified ?? entry.date,
            author: {
              '@type': 'Organization',
              name: 'Seoul Autonomous',
            },
            publisher: { '@type': 'Organization', name: 'Seoul Autonomous', logo: { '@type': 'ImageObject', url: 'https://seoulautonomous.com/icon.png' } },
            mainEntityOfPage: `https://seoulautonomous.com/${locale}/updates/${entry.slug}`,
            image: 'https://seoulautonomous.com/og/seoul-autonomous-og.jpg',
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

      <PageHero eyebrow={tp('updates.eyebrow')} title={title} crumbs={<Crumbs label={tp('crumbs')} items={[{ href: '/', label: ts('nav.home') }, { href: '/updates', label: t('breadcrumb') }, { label: title }]} />}>
      <div className={styles.dates}>
        <span className={styles.dateMeta}>
          {isKo ? '게시' : 'Posted'} {formatDate(entry.date, isKo)}
        </span>
        {/* 다시 쓴 글(R3b-2)은 수정일을 함께 보인다 — JSON-LD dateModified 와 같은 값 */}
        {entry.dateModified && entry.dateModified !== entry.date && (
          <>
            <span className={styles.dateSep}>·</span>
            <span className={styles.dateMeta}>
              {t('modifiedDate')} {formatDate(entry.dateModified, isKo)}
            </span>
          </>
        )}
        {/* 사이트 자체 공지(게시일 = 발생일 = 자료일)는 날짜를 한 번만 보인다 */}
        {entry.eventDate !== entry.date && (
          <>
            <span className={styles.dateSep}>·</span>
            <span className={styles.dateMeta}>
              {t('eventDate')} {formatDate(entry.eventDate, isKo)}
            </span>
          </>
        )}
        {entry.sourcePublishedAt !== entry.date && (
          <>
            <span className={styles.dateSep}>·</span>
            <span className={styles.dateMeta}>
              {t('sourceDate')} {formatDate(entry.sourcePublishedAt, isKo)}
            </span>
          </>
        )}
      </div>
      </PageHero>
      <Section size="tight" width="text" ariaLabel={title}>
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
            // 로보택시(onDemand)는 전용 상세가 없어 카드가 있는 late-night 페이지로 연결한다.
            const service = getOnDemandServices().find((svc) => svc.id === id);
            if (service) {
              return (
                <Link
                  key={id}
                  href="/routes/late-night"
                  className={styles.routeChip}
                >
                  {isKo ? service.displayNameKo : service.displayName}
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
        {/* 콘텐츠형 기사: 명사형 고유 소제목 섹션. 공지형 고정 라벨을 쓰지 않는다. */}
        {entry.articleSections?.map((sec, i) => (
          <section key={i} className={styles.section}>
            <h2 className={styles.h2}>{isKo ? sec.heading.ko : sec.heading.en}</h2>
            {(isKo ? sec.paragraphs.ko : sec.paragraphs.en).map((p, j) => (
              <p key={j} className={styles.paragraph}>{isKo ? p : koSpans(p)}</p>
            ))}
            {sec.bullets && (
              <ul className={styles.infoList}>
                {(isKo ? sec.bullets.ko : sec.bullets.en).map((item, j) => (
                  <li key={j} className={styles.infoItem}>{isKo ? item : koSpans(item)}</li>
                ))}
              </ul>
            )}
            {sec.links && (
              <p className={styles.sectionLinks}>
                {sec.links.map((l) => (
                  <Link key={l.href} href={l.href} className={styles.sectionLink}>
                    {isKo ? l.label.ko : l.label.en} →
                  </Link>
                ))}
              </p>
            )}
          </section>
        ))}

        {!entry.articleSections && s && (
          <>
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

            {/* 보도 참고 항목이 없는 기사(공식 출처 단독)는 섹션 자체를 만들지 않는다. */}
            {(isKo ? s.reportedInfo.ko : s.reportedInfo.en).length > 0 && (
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
            )}

            <section className={styles.section}>
              <h2 className={styles.h2}>{t('checkBefore')}</h2>
              <p className={styles.paragraph}>
                {isKo ? s.checkBefore.ko : s.checkBefore.en}
              </p>
            </section>
          </>
        )}

        {entry.sourceUrl && (
          <a
            href={entry.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewRoute}
          >
            {`${t('officialSource')} · ${formatDate(entry.sourcePublishedAt, isKo)}`}
          </a>
        )}

        {entry.extraSources?.map((src) => (
          <a
            key={src.url}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewRoute}
          >
            {`${t('extraSourcePrefix')} ${isKo ? src.label.ko : src.label.en} · ${formatDate(src.publishedAt, isKo)}`}
          </a>
        ))}

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
      </Section>
    </>
  );
}
