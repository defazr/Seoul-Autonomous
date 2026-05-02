import { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { colors, spacing } from '../../lib/design/tokens';
import { FixedRoute, OnDemandService } from '../../lib/types';
import { StatusDot } from '../../components/ui/StatusDot';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { RouteCard } from '../../components/ui/RouteCard';
import { RobotaxiCard } from '../../components/ui/RobotaxiCard';
import { IconSensor, IconSearch } from '../../components/ui/icons';
import routesData from '../../data/routes.json';

const fixedRoutes = routesData.fixedRoutes as FixedRoute[];
const onDemandServices = routesData.onDemandServices as OnDemandService[];

type Filter = 'ALL' | 'BUS' | 'TAXI';

const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '');

function matchQuery(route: FixedRoute, q: string): boolean {
  if (!q.trim()) return true;
  const nq = normalize(q);
  const fields = [
    route.displayName,
    route.displayNameKo,
    route.startPoint,
    route.startPointKo,
    route.endPoint,
    route.endPointKo,
  ];
  return fields.some((f) => normalize(f).includes(nq));
}

export default function RoutesScreen() {
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const isKo = i18n.language === 'ko';
  const [filter, setFilter] = useState<Filter>('ALL');
  const [query, setQuery] = useState('');

  const showBus = filter === 'ALL' || filter === 'BUS';
  const showTaxi = filter === 'ALL' || filter === 'TAXI';

  const filteredBus = showBus ? fixedRoutes.filter((r) => matchQuery(r, query)) : [];
  const filteredTaxi = showTaxi ? onDemandServices : [];
  const total = filteredBus.length + filteredTaxi.length;

  const filterOptions = [
    { value: 'ALL', label: t('routes.filter.all') },
    { value: 'BUS', label: t('routes.filter.bus') },
    { value: 'TAXI', label: t('routes.filter.robotaxi') },
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
            {t('routes.title')}
          </Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <IconSearch size={16} color={colors.fg[3]} />
            <TextInput
              style={[styles.searchInput, isKo && styles.searchInputKo]}
              placeholder={t('routes.search.placeholder')}
              placeholderTextColor={colors.fg[3]}
              value={query}
              onChangeText={setQuery}
              clearButtonMode="while-editing"
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />
          </View>
        </View>

        {/* SegmentedControl */}
        <View style={styles.segmentWrap}>
          <SegmentedControl
            options={filterOptions}
            value={filter}
            onChange={(v) => setFilter(v as Filter)}
          />
        </View>

        {/* Count ribbon */}
        <View style={styles.countRibbon}>
          <StatusDot color={colors.accent.DEFAULT} size={6} />
          <Text style={styles.countText}>
            {t('routes.count', { count: total })}
          </Text>
        </View>

        {/* Verified routes section */}
        {filteredBus.length > 0 && (
          <>
            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>
                {t('routes.section.verified')}
              </Text>
              <Text style={styles.sectionCount}>
                {String(filteredBus.length).padStart(2, '0')}
              </Text>
            </View>
            <View style={styles.routesList}>
              {filteredBus.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </View>
          </>
        )}

        {/* Robotaxi section */}
        {filteredTaxi.length > 0 && (
          <>
            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>
                {t('routes.section.robotaxi')}
              </Text>
              <Text style={styles.sectionCount}>
                {String(filteredTaxi.length).padStart(2, '0')}
              </Text>
            </View>
            <View style={styles.routesList}>
              {filteredTaxi.map((svc) => (
                <RobotaxiCard key={svc.id} service={svc} />
              ))}
            </View>
          </>
        )}

        {/* Empty state */}
        {total === 0 && (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, isKo && styles.textKo]}>
              {query.trim() ? t('routes.search.empty') : t('routes.empty')}
            </Text>
          </View>
        )}

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
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 8,
    gap: 16,
    marginBottom: 24,
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
  // Search
  searchWrap: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg[2],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border[1],
    paddingHorizontal: 14,
    gap: 10,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Geist-Regular',
    fontSize: 15,
    lineHeight: 20,
    color: colors.fg[1],
    padding: 0,
  },
  searchInputKo: {
    fontFamily: 'Pretendard-Regular',
  },
  // Segment
  segmentWrap: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: 12,
  },
  // Count
  countRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.screenPadding,
    marginBottom: 24,
  },
  countText: {
    fontFamily: 'GeistMono-Medium',
    fontSize: 12,
    lineHeight: 16,
    color: colors.fg[3],
    letterSpacing: 0.06 * 12,
  },
  // Section
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: 10,
  },
  sectionLabelText: {
    fontFamily: 'Geist-Medium',
    fontSize: 12,
    lineHeight: 16,
    color: colors.fg[3],
    letterSpacing: 0.10 * 12,
    textTransform: 'uppercase',
  },
  sectionCount: {
    fontFamily: 'GeistMono-Medium',
    fontSize: 12,
    lineHeight: 16,
    color: colors.fg[4],
    letterSpacing: 0.04 * 12,
  },
  routesList: {
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.cardGap,
    marginBottom: 28,
  },
  // Empty
  empty: {
    paddingVertical: 40,
    paddingHorizontal: spacing.screenPadding,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Geist-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.fg[4],
  },
  textKo: {
    fontFamily: 'Pretendard-Regular',
  },
  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 16,
  },
  footerText: {
    flex: 1,
    fontFamily: 'Geist-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: colors.fg[4],
  },
});
