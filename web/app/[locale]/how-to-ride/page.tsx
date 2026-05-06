import { getTranslations } from 'next-intl/server';
import { routing } from '../../../i18n/routing';
import { Link } from '../../../i18n/navigation';
import { SiteFooter } from '../../../components/common/SiteFooter';
import { PageContainer } from '../../../components/layout/PageContainer';
import { breadcrumbJsonLd } from '../../../lib/seo/jsonld';
import { HeroCard } from '../../../components/how-to-ride/HeroCard';
import { FAQItem } from '../../../components/how-to-ride/FAQItem';
import { StepCard } from '../../../components/how-to-ride/StepCard';
import { KakaoCard } from '../../../components/how-to-ride/KakaoCard';
import { BulletRow } from '../../../components/how-to-ride/BulletRow';
import { HowToRideClient } from './HowToRideClient';
import styles from './page.module.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('howToRideTitle'),
    description: t('howToRideDescription'),
  };
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={12} cy={12} r={10} />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

export default async function HowToRidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isKo = locale === 'ko';

  const faqs = [
    { id: 'q1', q: t('howToRide.faq.q1.q'), a: [t('howToRide.faq.q1.a1'), t('howToRide.faq.q1.a2')] },
    { id: 'q2', q: t('howToRide.faq.q2.q'), a: [t('howToRide.faq.q2.a1')] },
    { id: 'q3', q: t('howToRide.faq.q3.q'), a: [t('howToRide.faq.q3.a1'), t('howToRide.faq.q3.a2')] },
    { id: 'q4', q: t('howToRide.faq.q4.q'), a: [t('howToRide.faq.q4.a1')] },
    { id: 'q5', q: t('howToRide.faq.q5.q'), a: [t('howToRide.faq.q5.a1')] },
  ];

  const steps = [
    { step: 1, title: t('howToRide.steps.s1.title'), desc: t('howToRide.steps.s1.desc') },
    { step: 2, title: t('howToRide.steps.s2.title'), desc: t('howToRide.steps.s2.desc') },
    { step: 3, title: t('howToRide.steps.s3.title'), desc: t('howToRide.steps.s3.desc') },
    { step: 4, title: t('howToRide.steps.s4.title'), desc: t('howToRide.steps.s4.desc') },
  ];

  const kakaoSteps = [
    t('howToRide.kakao.step1'),
    t('howToRide.kakao.step2'),
    t('howToRide.kakao.step3'),
    t('howToRide.kakao.step4'),
  ];

  const tips = [
    t('howToRide.tips.t1'),
    t('howToRide.tips.t2'),
    t('howToRide.tips.t3'),
    t('howToRide.tips.t4'),
  ];

  // Korean H2 structure for SEO
  const koH2 = {
    intro: '자율주행버스와 무인버스, 같은 의미로 검색되는 경우가 많습니다',
    checkFirst: '서울 자율주행버스 이용 전 확인할 것',
    findStop: '정류장 찾는 방법',
    howToBoard: '탑승 방법',
    kakaoT: '카카오T 로보택시 이용 방법',
    faq: '자주 묻는 질문',
  };

  // Shared content sections
  const heroSection = (
    <div className={styles.section}>
      <HeroCard
        title={t('howToRide.hero.title')}
        description={t('howToRide.hero.description')}
        bullets={[
          t('howToRide.hero.bullet1'),
          t('howToRide.hero.bullet2'),
          t('howToRide.hero.bullet3'),
        ]}
      />
    </div>
  );

  const stepsSection = (
    <div className={styles.section}>
      <div className={styles.stepsGrid}>
        {steps.map((s) => (
          <StepCard
            key={s.step}
            step={s.step}
            title={s.title}
            description={s.desc}
          />
        ))}
      </div>
    </div>
  );

  const faqSection = (
    <div className={styles.section}>
      {faqs.map((faq) => (
        <FAQItem key={faq.id} question={faq.q} answer={faq.a} />
      ))}
    </div>
  );

  const kakaoSection = (
    <div className={styles.section}>
      <KakaoCard
        title={t('howToRide.kakao.title')}
        titleKr={t('howToRide.kakao.titleKr')}
        steps={kakaoSteps}
        note={t('howToRide.kakao.note')}
        isKo={isKo}
      />
    </div>
  );

  const tipsSection = (
    <div className={styles.section}>
      <div className={styles.tipsCard}>
        {tips.map((tip, i) => (
          <div
            key={i}
            className={`${styles.tipRow} ${i < tips.length - 1 ? styles.tipBorder : ''}`}
          >
            <BulletRow text={tip} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <PageContainer width="default">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: t('howToRide.title'), path: '/how-to-ride' }], locale)) }}
      />
      {/* TopBar */}
      <div className={styles.topBar}>
        <Link href="/" className={styles.backBtn}>
          <ChevronLeft />
        </Link>
        <Link href="/" className={styles.topTitle}>{t('howToRide.title')}</Link>

      </div>

      {/* H1 */}
      <h1 className={styles.heading}>{t('howToRide.webTitle')}</h1>

      {isKo ? (
        <>
          {/* Korean SEO structure with H2s */}
          <h2 className={styles.h2}>{koH2.intro}</h2>
          <p className={styles.introText}>
            서울에서 운행 중인 자율주행버스는 무인버스라고도 불리며, 서울특별시가 운영하는 시범 노선입니다. 이 페이지에서는 자율주행 버스와 로보택시를 이용하는 방법을 안내합니다.
          </p>

          {heroSection}

          <h2 className={styles.h2}>{koH2.checkFirst}</h2>
          <div className={styles.section}>
            <div className={styles.tipsCard}>
              {tips.map((tip, i) => (
                <div
                  key={i}
                  className={`${styles.tipRow} ${i < tips.length - 1 ? styles.tipBorder : ''}`}
                >
                  <BulletRow text={tip} />
                </div>
              ))}
            </div>
          </div>

          <h2 className={styles.h2}>{koH2.findStop}</h2>
          <div className={styles.section}>
            <div className={styles.stepsGrid}>
              <StepCard step={1} title={steps[0].title} description={steps[0].desc} />
              <StepCard step={2} title={steps[1].title} description={steps[1].desc} />
            </div>
          </div>

          <h2 className={styles.h2}>{koH2.howToBoard}</h2>
          <div className={styles.section}>
            <div className={styles.stepsGrid}>
              <StepCard step={3} title={steps[2].title} description={steps[2].desc} />
              <StepCard step={4} title={steps[3].title} description={steps[3].desc} />
            </div>
          </div>

          <h2 className={styles.h2}>{koH2.kakaoT}</h2>
          {kakaoSection}

          <h2 className={styles.h2}>{koH2.faq}</h2>
          {faqSection}
        </>
      ) : (
        <>
          {/* English: app structure with SegmentedControl */}
          <HowToRideClient
            filterBuses={t('howToRide.filter.buses')}
            filterRobotaxis={t('howToRide.filter.robotaxis')}
            heroSection={heroSection}
            faqSectionTitle={t('howToRide.faq.sectionTitle')}
            faqSection={faqSection}
            stepsSectionTitle={t('howToRide.steps.sectionTitle')}
            stepsSection={stepsSection}
            kakaoSectionTitle={t('howToRide.kakao.sectionTitle')}
            kakaoSection={kakaoSection}
            tipsSectionTitle={t('howToRide.tips.sectionTitle')}
            tipsSection={tipsSection}
          />
        </>
      )}

      <SiteFooter />
    </PageContainer>
  );
}
