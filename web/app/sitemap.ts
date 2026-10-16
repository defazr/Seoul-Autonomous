import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/seo/config';
import routesData from '../data/routes.json';
import type { FixedRoute } from '../lib/types/route';
import { getAllUpdates } from '../data/updates';
import { STOP_PLACES } from '../lib/stop-pages';
import { buildPlaceView } from '../lib/stop-places';
import { R3A_NIGHT_ROUTES, R3A_HUBS } from '../lib/night-bus/registry';
import nightBusDoc from '../data/night-bus-routes.json';

const fixedRoutes = routesData.fixedRoutes as FixedRoute[];

// 정류장 URL 은 장소 등록부 4곳(× ko/en)만 나온다 (R3b-1). 노선 소속은 Graph 파생이므로
// lastModified 도 하드코딩하지 않고 두 플랫폼 노선 합집합의 lastChecked 최대로 계산한다 (stop-places.ts).

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'ko'];
  // 정적 안내 페이지의 lastmod = 마지막 내용 변경일(빌드 시각 X — SEO 감사 FIX 8). v2 재탄생(2026-10-16)에서 전부 다시 썼다.
  const now = '2026-10-16';

  const staticPages = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
    { path: '/routes', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/how-to-ride', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/faq', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/data-source', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/updates', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/routes/early-morning', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/routes/late-night', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            en: `${SITE_URL}/en${page.path}`,
            'x-default': `${SITE_URL}/en${page.path}`,
            ko: `${SITE_URL}/ko${page.path}`,
          },
        },
      });
    }
  }

  for (const route of fixedRoutes) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/routes/${route.id}`,
        lastModified: route.lastChecked,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: {
          languages: {
            en: `${SITE_URL}/en/routes/${route.id}`,
            'x-default': `${SITE_URL}/en/routes/${route.id}`,
            ko: `${SITE_URL}/ko/routes/${route.id}`,
          },
        },
      });
    }
  }

  for (const place of STOP_PLACES) {
    const { lastChecked } = buildPlaceView(place);
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/stops/${place.slug}`,
        lastModified: lastChecked,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: {
          languages: {
            en: `${SITE_URL}/en/stops/${place.slug}`,
            'x-default': `${SITE_URL}/en/stops/${place.slug}`,
            ko: `${SITE_URL}/ko/stops/${place.slug}`,
          },
        },
      });
    }
  }

  for (const update of getAllUpdates()) {
    if (update.customRender) {
      // ko 전용 글 — en alternate 없음
      entries.push({
        url: `${SITE_URL}/ko/updates/${update.slug}`,
        lastModified: update.dateModified ?? update.date,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      });
    } else {
      for (const locale of locales) {
        entries.push({
          url: `${SITE_URL}/${locale}/updates/${update.slug}`,
          lastModified: update.dateModified ?? update.date,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
          alternates: {
            languages: {
              en: `${SITE_URL}/en/updates/${update.slug}`,
              'x-default': `${SITE_URL}/en/updates/${update.slug}`,
              ko: `${SITE_URL}/ko/updates/${update.slug}`,
            },
          },
        });
      }
    }
  }

  // R3a: 올빼미버스 노선 페이지 (ko 전용 · 등록부 범위만)
  for (const no of R3A_NIGHT_ROUTES) {
    entries.push({
      url: `${SITE_URL}/ko/night-bus/${no.toLowerCase()}`,
      lastModified: nightBusDoc._meta.stopsSource.snapshot,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    });
  }

  for (const slug of R3A_HUBS) {
    entries.push({
      url: `${SITE_URL}/ko/hubs/${slug}`,
      lastModified: nightBusDoc._meta.stopsSource.snapshot,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    });
  }

  // ko-only pages (no en alternate)
  entries.push({
    url: `${SITE_URL}/ko/night-bus-map`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  });

  // en night-bus guide (standalone entry, no ko alternate link)
  entries.push({
    url: `${SITE_URL}/en/night-bus-map`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  });

  // ko-only practical guides (no en alternate)
  entries.push({
    url: `${SITE_URL}/ko/night-bus-fare`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  });
  entries.push({
    url: `${SITE_URL}/ko/after-last-train`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  });

  return entries;
}
