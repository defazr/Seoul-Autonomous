import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { colors, spacing, typography } from '../../lib/design/tokens';
import { FixedRoute } from '../../lib/types';
import { StatusDot } from '../../components/ui/StatusDot';
import { Button } from '../../components/ui/Button';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { RouteCard } from '../../components/ui/RouteCard';
import { LangToggle } from '../../components/ui/LangToggle';
import { IconArrowR, IconSensor } from '../../components/ui/icons';
import routesData from '../../data/routes.json';

const FEATURED_IDS = [
  'cheonggye-a01',
  'cheongwadae-a01',
  'sangam-a21',
  'simya-a21',
];

const verifiedRoutes = (routesData.fixedRoutes as FixedRoute[]).filter(
  (r) =>
    r.verificationLevel === 'kakao_seoul_verified' ||
    r.verificationLevel === 'official_confirmed'
);

const featuredRoutes = FEATURED_IDS.map((id) =>
  verifiedRoutes.find((r) => r.id === id)
).filter(Boolean) as FixedRoute[];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isKo = i18n.language === 'ko';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoMark}>
              <IconSensor size={20} color={colors.accent.DEFAULT} />
            </View>
            <Text style={styles.headerTitle}>Seoul Autonomous</Text>
          </View>
          <LangToggle />
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <StatusDot color={colors.accent.DEFAULT} size={6} />
            <Text style={styles.heroBadgeText}>
              {t('home.hero.badge', { count: verifiedRoutes.length })}
            </Text>
          </View>

          <Text style={[styles.heroTitle, isKo && styles.heroTitleKo]}>{t('home.hero.title')}</Text>
          <Text style={[styles.heroDesc, isKo && styles.textKo]}>{t('home.hero.description')}</Text>

          <Button
            variant="primary"
            size="md"
            onPress={() => router.push('/(tabs)/routes')}
            icon={<IconArrowR size={14} color="#000" />}
          >
            {t('home.hero.cta')}
          </Button>
        </View>

        {/* Featured routes */}
        <SectionHeader
          title={t('home.featured.title')}
          action={t('home.featured.seeAll')}
          onAction={() => router.push('/(tabs)/routes')}
        />
        <View style={styles.routesList}>
          {featuredRoutes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </View>

        {/* Footer note */}
        <View style={styles.footer}>
          <IconSensor size={16} color={colors.fg[4]} />
          <Text style={styles.footerText}>{t('home.footer.note')}</Text>
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
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 8,
    marginBottom: 28,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.accent.faint,
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 15,
    lineHeight: 18,
    color: colors.fg[1],
    letterSpacing: -0.01 * 15,
  },
  // Hero
  hero: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.sectionGap,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
    paddingLeft: 8,
    paddingRight: 10,
    borderRadius: 999,
    backgroundColor: colors.accent.faint,
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.25)',
    alignSelf: 'flex-start',
    marginBottom: 18,
  },
  heroBadgeText: {
    fontFamily: 'GeistMono-Medium',
    fontSize: 11,
    lineHeight: 14,
    color: colors.accent.DEFAULT,
    letterSpacing: 0.08 * 11,
  },
  heroTitle: {
    fontFamily: 'Geist-Bold',
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.035 * 36,
    color: colors.fg[1],
    marginBottom: 14,
  },
  heroTitleKo: {
    fontFamily: 'Pretendard-SemiBold',
  },
  heroDesc: {
    fontFamily: 'Geist-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: colors.fg[3],
    marginBottom: 22,
    maxWidth: 320,
  },
  textKo: {
    fontFamily: 'Pretendard-Regular',
  },
  // Routes list
  routesList: {
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.cardGap,
    marginBottom: spacing.sectionGap,
  },
  // Footer
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
