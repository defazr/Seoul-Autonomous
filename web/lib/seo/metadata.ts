import { SITE_URL, SITE_NAME } from './config';
import type { Metadata } from 'next';

const OG_IMAGE_URL = `${SITE_URL}/og/seoul-autonomous-og.png`;
const OG_IMAGE_ALT =
  'Seoul Autonomous — guide to autonomous bus and robotaxi routes in Seoul';

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
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
      type: 'website',
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
