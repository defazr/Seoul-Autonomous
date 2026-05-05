import { SITE_URL, SITE_NAME } from './config';

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "An independent guide to Seoul's autonomous bus and robotaxi pilot services for international visitors.",
    inLanguage: ['en', 'ko'],
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  locale: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}/${locale}${item.path}`,
    })),
  };
}
