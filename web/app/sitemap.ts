import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/seo/config';
import routesData from '../data/routes.json';
import type { FixedRoute } from '../lib/types/route';

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

  return entries;
}
