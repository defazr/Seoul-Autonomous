import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { colors, spacing } from '../../lib/design/tokens';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { HeroCard } from '../../components/ui/HeroCard';
import { FAQItem } from '../../components/ui/FAQItem';
import { StepCard } from '../../components/ui/StepCard';
import { KakaoCard } from '../../components/ui/KakaoCard';
import { BulletRow } from '../../components/ui/BulletRow';
import { IconSensor, IconCheck } from '../../components/ui/icons';

type Tab = 'BUS' | 'TAXI';

export default function HowToRideScreen() {
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const isKo = i18n.language === 'ko';
  const [tab, setTab] = useState<Tab>('BUS');

  const filterOptions = [
    { value: 'BUS', label: t('howToRide.filter.buses') },
    { value: 'TAXI', label: t('howToRide.filter.robotaxis') },
  ];

  const faqs = [
    {
      id: 'q1',
      q: t('howToRide.faq.q1.q'),
      a: [t('howToRide.faq.q1.a1'), t('howToRide.faq.q1.a2')],
      defaultOpen: true,
    },
    {
      id: 'q2',
      q: t('howToRide.faq.q2.q'),
      a: [t('howToRide.faq.q2.a1')],
    },
    {
      id: 'q3',
      q: t('howToRide.faq.q3.q'),
      a: [t('howToRide.faq.q3.a1'), t('howToRide.faq.q3.a2')],
      defaultOpen: true,
    },
    {
      id: 'q4',
      q: t('howToRide.faq.q4.q'),
      a: [t('howToRide.faq.q4.a1')],
    },
    {
      id: 'q5',
      q: t('howToRide.faq.q5.q'),
      a: [t('howToRide.faq.q5.a1')],
    },
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.heading, isKo && styles.headingKo]}>
            {t('howToRide.title')}
          </Text>
        </View>

        {/* Segmented Control */}
        <View style={styles.segmentWrap}>
          <SegmentedControl
            options={filterOptions}
            value={tab}
            onChange={(v) => setTab(v as Tab)}
          />
        </View>

        {/* Hero Card */}
        <View style={styles.section}>
          <HeroCard
            title={t('howToRide.hero.title')}
            description={t('howToRide.hero.description')}
            bullets={[
              t('howToRide.hero.bullet1'),
              t('howToRide.hero.bullet2'),
              t('howToRide.hero.bullet3'),
            ]}
            isKo={isKo}
          />
        </View>

        {/* FAQ */}
        <Eyebrow>{t('howToRide.faq.sectionTitle')}</Eyebrow>
        <View style={styles.section}>
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              question={faq.q}
              answer={faq.a}
              defaultOpen={faq.defaultOpen}
              isKo={isKo}
            />
          ))}
        </View>

        {/* Visual Guide */}
        <Eyebrow>{t('howToRide.steps.sectionTitle')}</Eyebrow>
        <View style={styles.section}>
          <View style={styles.stepsGrid}>
            {steps.map((s) => (
              <StepCard
                key={s.step}
                step={s.step}
                title={s.title}
                description={s.desc}
                isKo={isKo}
              />
            ))}
          </View>
        </View>

        {/* Kakao Card (Robotaxis tab only) */}
        {tab === 'TAXI' && (
          <>
            <Eyebrow>{t('howToRide.kakao.sectionTitle')}</Eyebrow>
            <View style={styles.section}>
              <KakaoCard
                title={t('howToRide.kakao.title')}
                titleKr={t('howToRide.kakao.titleKr')}
                steps={kakaoSteps}
                note={t('howToRide.kakao.note')}
                isKo={isKo}
              />
            </View>
          </>
        )}

        {/* Tips */}
        <Eyebrow>{t('howToRide.tips.sectionTitle')}</Eyebrow>
        <View style={styles.section}>
          <View style={styles.tipsCard}>
            {tips.map((tip, i) => (
              <View
                key={i}
                style={[
                  styles.tipRow,
                  i < tips.length - 1 && styles.tipBorder,
                ]}
              >
                <BulletRow text={tip} useCheck isKo={isKo} />
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <IconSensor size={16} color={colors.fg[4]} />
          <Text style={styles.footerText}>{t('common.footer')}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg[0],
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 8,
    marginBottom: 20,
  },
  heading: {
    fontFamily: 'Geist-Bold',
    fontSize: 32,
    lineHeight: 36,
    color: colors.fg[1],
    letterSpacing: -0.03 * 32,
  },
  headingKo: {
    fontFamily: 'Pretendard-SemiBold',
  },
  segmentWrap: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: 24,
  },
  section: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: 32,
  },
  stepsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tipsCard: {
    backgroundColor: colors.bg[2],
    borderWidth: 1,
    borderColor: colors.border[1],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tipRow: {
    paddingVertical: 12,
  },
  tipBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border[1],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: spacing.screenPadding,
  },
  footerText: {
    flex: 1,
    fontFamily: 'Geist-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: colors.fg[4],
  },
});
