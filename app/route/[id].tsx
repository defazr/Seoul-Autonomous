import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { colors, spacing, radius } from '../../lib/design/tokens';
import { FixedRoute } from '../../lib/types';
import { Pill } from '../../components/ui/Pill';
import { StatusDot } from '../../components/ui/StatusDot';
import { KrLine } from '../../components/ui/KrLine';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { Button } from '../../components/ui/Button';
import { RouteDiagram } from '../../components/ui/RouteDiagram';
import { InfoCardItem } from '../../components/ui/InfoCardItem';
import { StopsList } from '../../components/ui/StopsList';
import { MapLinkButtons } from '../../components/ui/MapLinkButtons';
import { IconChevL, IconBus, IconSensor, IconArrowR } from '../../components/ui/icons';
import { formatDate } from '../../lib/utils/date';
import routesData from '../../data/routes.json';

const fixedRoutes = routesData.fixedRoutes as FixedRoute[];

function formatDays(days: string, t: (key: string) => string): string {
  if (days === 'weekday') return t('routeDetail.days.weekday');
  if (days === 'weekend') return t('routeDetail.days.weekend');
  if (days === 'daily') return t('routeDetail.days.daily');
  return t('routeDetail.days.unknown');
}

function formatHours(first: string, last: string): string {
  if (first === last) return first;
  return `${first} – ${last}`;
}

export default function RouteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const isKo = i18n.language === 'ko';

  const route = fixedRoutes.find((r) => r.id === id);

  // Fallback for invalid id
  if (!route) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.fallback}>
          <Text style={[styles.fallbackTitle, isKo && styles.textKo]}>
            {t('routeDetail.notFound.title')}
          </Text>
          <Button variant="secondary" onPress={() => router.push('/(tabs)/routes')}>
            {t('routeDetail.notFound.cta')}
          </Button>
        </View>
      </View>
    );
  }

  const name = isKo ? route.displayNameKo : route.displayName;
  const subName = isKo ? route.displayName : route.displayNameKo;
  const stops = route.stops || [];
  const turnIdx = stops.findIndex((s) => s.isTurnaround);
  const turnStop = turnIdx >= 0 ? stops[turnIdx] : null;
  const startStop = stops[0];
  const endStop = stops[stops.length - 1];

  const startName = isKo ? (startStop?.nameKo || route.startPointKo) : route.startPoint;
  const endName = isKo ? (endStop?.nameKo || route.endPointKo) : route.endPoint;
  const turnName = turnStop ? turnStop.nameKo : '';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* TopBar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <IconChevL size={18} color={colors.fg[1]} />
        </Pressable>
        <View style={styles.badges}>
          <View style={styles.codeBadge}>
            <Text style={styles.codeBadgeText}>{route.displayName.toUpperCase()}</Text>
          </View>
          <View style={styles.typeBadge}>
            <IconBus size={12} color={colors.fg[3]} />
            <Text style={styles.typeBadgeText}>BUS</Text>
          </View>
        </View>
        <Pill variant="accent">
          <StatusDot color={colors.accent.DEFAULT} size={5} />
          <Text style={pillText}>VERIFIED</Text>
        </Pill>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.section}>
          <Text style={[styles.heading, isKo && styles.headingKo]}>{name}</Text>
          <KrLine style={styles.subName}>{subName}</KrLine>

          {route.operator !== 'Unknown' && (
            <View style={styles.operatorRow}>
              <IconSensor size={14} color={colors.accent.DEFAULT} />
              <Text style={styles.operatorText}>{route.operator}</Text>
            </View>
          )}

          <Text style={styles.checkedDate}>
            {t('routeDetail.label.lastChecked')}: {formatDate(route.lastChecked, isKo)}
          </Text>
          <Text style={styles.disclaimer}>{t('routeDetail.disclaimer')}</Text>
        </View>

        {/* Route Diagram */}
        {stops.length > 0 && turnStop && (
          <View style={styles.section}>
            <RouteDiagram
              stops={stops}
              startName={startName}
              endName={endName}
              turnaroundName={turnName}
              outboundLabel={t('routeDetail.diagram.outbound', { from: startName, to: turnName })}
              inboundLabel={t('routeDetail.diagram.inbound', { from: turnName, to: endName })}
            />
          </View>
        )}

        {/* Info Cards 2x2 */}
        <Eyebrow>{t('routeDetail.info.verified')}</Eyebrow>
        <View style={styles.section}>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <InfoCardItem
                label={t('routeDetail.info.hours')}
                value={formatHours(route.firstBus, route.lastBus)}
              />
              <InfoCardItem
                label={t('routeDetail.info.days')}
                value={formatDays(route.daysOfOperation, t)}
              />
            </View>
            <View style={styles.infoRow}>
              <InfoCardItem
                label={t('routeDetail.info.stops')}
                value={t('routeDetail.stops.count', { count: stops.length })}
                accent
              />
              <InfoCardItem
                label={t('routeDetail.info.verified')}
                value={formatDate(route.lastChecked, isKo)}
              />
            </View>
          </View>
        </View>

        {/* How to ride summary */}
        <Eyebrow>{t('routeDetail.howToRide.title')}</Eyebrow>
        <View style={styles.section}>
          {[
            { n: 1, text: t('routeDetail.howToRide.step1') },
            { n: 2, text: t('routeDetail.howToRide.step2') },
            { n: 3, text: t('routeDetail.howToRide.step3') },
          ].map((step, i, arr) => (
            <View key={step.n} style={styles.miniStep}>
              <View style={styles.miniStepNum}>
                <Text style={styles.miniStepNumText}>{step.n}</Text>
              </View>
              <View style={[styles.miniStepBody, i < arr.length - 1 && styles.miniStepBorder]}>
                <Text style={[styles.miniStepText, isKo && styles.textKo]}>{step.text}</Text>
              </View>
            </View>
          ))}
          <Pressable
            onPress={() => router.push('/(tabs)/how-to-ride')}
            style={styles.readMoreBtn}
          >
            <Text style={styles.readMoreText}>{t('routeDetail.howToRide.readMore')}</Text>
            <IconArrowR size={14} color={colors.fg[1]} />
          </Pressable>
        </View>

        {/* Stops List */}
        {stops.length > 0 && (
          <>
            <Eyebrow>{`${t('routeDetail.stops.sectionTitle')} (${stops.length})`}</Eyebrow>
            <View style={styles.section}>
              <StopsList stops={stops} />
            </View>
          </>
        )}

        {/* Footer */}
        <View style={styles.footerNote}>
          <IconSensor size={16} color={colors.fg[3]} />
          <Text style={styles.footerText}>
            {t('routeDetail.footer', { date: formatDate(route.lastChecked, isKo) })}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky bottom map links */}
      <MapLinkButtons displayNameKo={route.displayNameKo} />
    </View>
  );
}

const pillText: any = {
  fontFamily: 'Geist-Medium',
  fontSize: 11,
  lineHeight: 14,
  letterSpacing: 0.08 * 11,
  textTransform: 'uppercase',
  color: colors.accent.DEFAULT,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg[0],
  },
  // Fallback
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: spacing.screenPadding,
  },
  fallbackTitle: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 20,
    color: colors.fg[1],
  },
  // TopBar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10,
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.bg[2],
    borderWidth: 1,
    borderColor: colors.border[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  badges: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  codeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: colors.bg[3],
    borderWidth: 1,
    borderColor: colors.border[2],
  },
  codeBadgeText: {
    fontFamily: 'GeistMono-Medium',
    fontSize: 11,
    lineHeight: 14,
    color: colors.fg[2],
    letterSpacing: 0.06 * 11,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border[2],
  },
  typeBadgeText: {
    fontFamily: 'Geist-Medium',
    fontSize: 11,
    lineHeight: 14,
    color: colors.fg[3],
    letterSpacing: 0.08 * 11,
  },
  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  section: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: 32,
  },
  // Title
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
  subName: {
    marginTop: 4,
    fontSize: 16,
    lineHeight: 22,
  },
  operatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border[1],
  },
  operatorText: {
    fontFamily: 'Geist-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: colors.fg[3],
  },
  checkedDate: {
    fontFamily: 'GeistMono-Medium',
    fontSize: 11,
    lineHeight: 14,
    color: colors.fg[4],
    letterSpacing: 0.04 * 11,
    marginTop: 6,
  },
  disclaimer: {
    fontFamily: 'Geist-Regular',
    fontSize: 11,
    lineHeight: 14,
    color: colors.status.warning,
    letterSpacing: 0.02 * 11,
    marginTop: 4,
  },
  // Info grid
  infoGrid: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  // How to ride mini
  miniStep: {
    flexDirection: 'row',
    gap: 14,
  },
  miniStepNum: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.4)',
    backgroundColor: colors.accent.faint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniStepNumText: {
    fontFamily: 'GeistMono-Medium',
    fontSize: 13,
    lineHeight: 16,
    color: colors.accent.DEFAULT,
  },
  miniStepBody: {
    flex: 1,
    paddingBottom: 16,
  },
  miniStepBorder: {
    borderBottomWidth: 0,
  },
  miniStepText: {
    fontFamily: 'Geist-Medium',
    fontSize: 15,
    lineHeight: 20,
    color: colors.fg[1],
  },
  textKo: {
    fontFamily: 'Pretendard-Medium',
  },
  readMoreBtn: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border[2],
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  readMoreText: {
    fontFamily: 'Geist-Medium',
    fontSize: 14,
    lineHeight: 20,
    color: colors.fg[1],
  },
  // Footer
  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: spacing.screenPadding,
    marginBottom: 16,
  },
  footerText: {
    flex: 1,
    fontFamily: 'Geist-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: colors.fg[3],
  },
});
