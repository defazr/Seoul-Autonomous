import { SITE_URL, SITE_NAME } from './config';

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "An independent guide to late-night travel in Seoul: Owl Bus (N-bus) routes, stops and transfers, plus autonomous night and early-morning pilot routes, built on official data with reference dates.",
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
      // 보이는 빵부스러기와 같은 언어로 (호출부의 영어 리터럴 'Home'·'Routes' 를 ko 에서 현지화 — SEO 감사 FIX 6)
      name: locale === 'ko' ? ({ Home: '홈', Routes: '노선' }[item.name] ?? item.name) : item.name,
      item: `${SITE_URL}/${locale}${item.path}`,
    })),
  };
}
