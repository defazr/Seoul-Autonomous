import { Hero } from '../../components/home/Hero';
import { FeaturedRoutes } from '../../components/home/FeaturedRoutes';
import { CTASection } from '../../components/home/CTASection';
import { SiteFooter } from '../../components/common/SiteFooter';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <Hero />
      <FeaturedRoutes />
      <CTASection />
      <SiteFooter />
    </div>
  );
}
