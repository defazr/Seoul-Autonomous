import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '../../../lib/seo/config';
import { afterLastTrainKo } from '../../../data/night-bus-guides/after-last-train.ko';
import { AfterLastTrainGuideKo } from '../../../components/night-bus-guides/AfterLastTrainGuideKo';

/* ── Static params: ko only ── */
export function generateStaticParams() {
  return [{ locale: 'ko' }];
}
export const dynamicParams = false; // 생성 목록 밖 경로(다른 로케일·없는 id)는 요청 시점 notFound() 대신 정적 전역 404 로 (R3b-4 · 2026-10-18)

/* ── Metadata: ko only, self-canonical, no hreflang ── */
const PAGE_URL = `${SITE_URL}/ko/after-last-train`;
const OG_IMAGE_URL = `${SITE_URL}/og/seoul-autonomous-og.jpg`;

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
  setRequestLocale(locale); // 정적 프리렌더(next-intl) — 배포 전 점검 10-16

  // ko only — /en/after-last-train → 404
  if (locale !== 'ko') {
    notFound();
  }

  return <AfterLastTrainGuideKo />;
}
