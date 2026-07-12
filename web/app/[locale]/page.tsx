import { getTranslations } from 'next-intl/server';
import { Link } from '../../i18n/navigation';
import { Hero } from '../../components/home/Hero';
import { FeaturedRoutes } from '../../components/home/FeaturedRoutes';
import { ValueSection } from '../../components/home/ValueSection';
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.mapPromo' });

  return (
    <PageContainer width="default">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <Hero />
      <FeaturedRoutes />
      <ValueSection />
      {locale === 'ko' ? (
        <section className={styles.mapPromo}>
          <Link href="/night-bus-map" className={styles.mapPromoLink}>
            <span className={styles.mapPromoText}>{t('cta')}</span>
            <span className={styles.mapPromoArrow} aria-hidden="true">→</span>
          </Link>
        </section>
      ) : (
        <section className={styles.mapPromo}>
          <div className={styles.mapPromoTitle}>{t('title')}</div>
          <p className={styles.mapPromoDesc}>{t('description')}</p>
          <Link href="/night-bus-map" className={styles.mapPromoLink}>
            <span className={styles.mapPromoText}>{t('cta')}</span>
            <span className={styles.mapPromoArrow} aria-hidden="true">→</span>
          </Link>
        </section>
      )}
      <CTASection />
      <SiteFooter />
    </PageContainer>
  );
}
