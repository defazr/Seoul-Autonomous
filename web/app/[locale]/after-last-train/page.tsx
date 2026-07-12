import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '../../../lib/seo/config';
import { afterLastTrainKo } from '../../../data/night-bus-guides/after-last-train.ko';
import { AfterLastTrainGuideKo } from '../../../components/night-bus-guides/AfterLastTrainGuideKo';

/* ── Static params: ko only ── */
export function generateStaticParams() {
  return [{ locale: 'ko' }];
}

/* ── Metadata: ko only, self-canonical, no hreflang ── */
const PAGE_URL = `${SITE_URL}/ko/after-last-train`;
const OG_IMAGE_URL = `${SITE_URL}/og/seoul-autonomous-og.png`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'ko') return {};

  const { title, description, ogImageAlt } = afterLastTrainKo.metadata;
  return {
    title,
    description,
    alternates: {
      canonical: PAGE_URL,
    },
    openGraph: {
      title,
      description,
      url: PAGE_URL,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'ko_KR',
      images: [
        {
          url: OG_IMAGE_URL,
          secureUrl: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: OG_IMAGE_URL, alt: ogImageAlt }],
    },
  };
}

export default async function AfterLastTrainPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // ko only — /en/after-last-train → 404
  if (locale !== 'ko') {
    notFound();
  }

  return <AfterLastTrainGuideKo />;
}
