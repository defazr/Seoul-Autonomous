import { getTranslations } from 'next-intl/server';
import { Hero } from '../../components/home/Hero';
import { FeaturedRoutes } from '../../components/home/FeaturedRoutes';
import { CTASection } from '../../components/home/CTASection';
import { SiteFooter } from '../../components/common/SiteFooter';
import { PageContainer } from '../../components/layout/PageContainer';
import { websiteJsonLd } from '../../lib/seo/jsonld';
import { buildPageMetadata } from '../../lib/seo/metadata';
import styles from './page.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return buildPageMetadata({
    locale,
    path: '',
    title: t('homeTitle'),
    description: t('homeDescription'),
  });
}

export default function HomePage() {
  return (
    <PageContainer width="default">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <Hero />
      <FeaturedRoutes />
      <CTASection />
      <SiteFooter />
    </PageContainer>
  );
}
