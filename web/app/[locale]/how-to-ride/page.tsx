import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '../../../i18n/routing';
import { Link } from '../../../i18n/navigation';
import { Crumbs } from '../../../components/v2/ui/Crumbs';
import { PageHero } from '../../../components/v2/ui/PageHero';
import { Section } from '../../../components/v2/ui/Section';
import { breadcrumbJsonLd } from '../../../lib/seo/jsonld';
import { buildPageMetadata } from '../../../lib/seo/metadata';
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
  return buildPageMetadata({
    locale,
    path: '/how-to-ride',
    title: t('howToRideTitle'),
    description: t('howToRideDescription'),
  });
}

export default async function HowToRidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale); // 정적 프리렌더(next-intl) — 배포 전 점검 10-16
  const t = await getTranslations({ locale });
  const tp = await getTranslations({ locale, namespace: 'pages' });
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

  // 올빼미버스 타는 법 (배포 전 점검 10-16 · 정책 감사 FIX 1 — 사이트 정체성 = 심야 이동 중심)
  const owlSection = (
    <>
      <h2 className={styles.h2}>{t('howToRide.owl.title')}</h2>
      <p className={styles.introText}>{t('howToRide.owl.intro')}</p>
      <div className={styles.section}>
        <div className={styles.stepsGrid}>
          {[1, 2, 3, 4].map((i) => <StepCard key={i} step={i} title={t(`howToRide.owl.s${i}.title`)} description={t(`howToRide.owl.s${i}.desc`)} />)}
        </div>
      </div>
      <p className={styles.introText}>
        {isKo ? <><Link href="/night-bus-fare" className={styles.inlineLink}>{t('howToRide.owl.fareLink')} →</Link>{' · '}</> : null}
        <Link href="/night-bus-map" className={styles.inlineLink}>{t('howToRide.owl.mapLink')} →</Link>
      </p>
    </>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '' }, { name: t('howToRide.title'), path: '/how-to-ride' }], locale)) }}
      />

      <PageHero eyebrow={tp('howToRide.eyebrow')} title={t('howToRide.webTitle')} crumbs={<Crumbs label={tp('crumbs')} items={[{ href: '/', label: t('shell.nav.home') }, { label: t('howToRide.title') }]} />} />
      <Section size="tight" ariaLabel={t('howToRide.webTitle')}>

      {isKo ? (
        <>
          {owlSection}
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

          <p className={styles.introText}>
            막차가 끊긴 뒤 심야 이동이라면{' '}
            <Link href="/night-bus-map" className={styles.inlineLink}>서울 심야버스 노선도에서 환승 경로 확인하기</Link>
            를 함께 참고하세요.
          </p>

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
          {owlSection}
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
      </Section>
    </>
  );
}
