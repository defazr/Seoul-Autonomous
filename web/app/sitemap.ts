import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/seo/config';
import routesData from '../data/routes.json';
import type { FixedRoute } from '../lib/types/route';
import { getAllUpdates } from '../data/updates';

const fixedRoutes = routesData.fixedRoutes as FixedRoute[];

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'ko'];
  const now = new Date().toISOString();

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
            ko: `${SITE_URL}/ko/routes/${route.id}`,
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
        lastModified: update.date,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      });
    } else {
      for (const locale of locales) {
        entries.push({
          url: `${SITE_URL}/${locale}/updates/${update.slug}`,
          lastModified: update.date,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
          alternates: {
            languages: {
              en: `${SITE_URL}/en/updates/${update.slug}`,
              ko: `${SITE_URL}/ko/updates/${update.slug}`,
            },
          },
        });
      }
    }
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
