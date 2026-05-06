import { Hero } from '../../components/home/Hero';
import { FeaturedRoutes } from '../../components/home/FeaturedRoutes';
import { CTASection } from '../../components/home/CTASection';
import { SiteFooter } from '../../components/common/SiteFooter';
import { PageContainer } from '../../components/layout/PageContainer';
import { websiteJsonLd } from '../../lib/seo/jsonld';
import styles from './page.module.css';

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
