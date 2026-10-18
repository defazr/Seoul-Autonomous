import { SITE_URL, SITE_NAME } from './config';
import type { Metadata } from 'next';

const OG_IMAGE_URL = `${SITE_URL}/og/seoul-autonomous-og.jpg`; // PNG 964KB → JPG 210KB (배포 전 점검 10-16)
const OG_IMAGE_ALT =
  'Seoul Autonomous — Seoul late-night travel guide: Owl Bus routes, stops and transfers';

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  type = 'website',
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  /** 업데이트 글은 article (기술 SEO 감사 10-18 FIX 4) */
  type?: 'website' | 'article';
}): Metadata {
  const pageUrl = `${SITE_URL}/${locale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: {
        en: `${SITE_URL}/en${path}`,
        ko: `${SITE_URL}/ko${path}`,
        'x-default': `${SITE_URL}/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      type,
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      images: [
        {
          url: OG_IMAGE_URL,
          secureUrl: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        {
          url: OG_IMAGE_URL,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
  };
}
