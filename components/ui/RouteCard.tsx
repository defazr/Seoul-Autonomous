import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors, radius, spacing } from '../../lib/design/tokens';
import { FixedRoute } from '../../lib/types';
import { Card } from './Card';
import { Pill } from './Pill';
import { StatusDot } from './StatusDot';
import { KrLine } from './KrLine';
import { IconBus, IconChevR } from './icons';

type RouteCardProps = {
  route: FixedRoute;
  onPress?: () => void;
};

function StatusPill({ level }: { level: string }) {
  if (level === 'official_confirmed') {
    return (
      <Pill variant="success">
        <StatusDot color={colors.status.success} size={5} />
        <Text style={[pillTextStyle, { color: colors.status.success }]}>OFFICIAL</Text>
      </Pill>
    );
  }
  return (
    <Pill variant="accent">
      <StatusDot color={colors.accent.DEFAULT} size={5} />
      <Text style={[pillTextStyle, { color: colors.accent.DEFAULT }]}>VERIFIED</Text>
    </Pill>
  );
}

const pillTextStyle: any = {
  fontFamily: 'Geist-Medium',
  fontSize: 11,
  lineHeight: 14,
  letterSpacing: 0.08 * 11,
  textTransform: 'uppercase',
};

export function RouteCard({ route, onPress }: RouteCardProps) {
  const router = useRouter();
  const { i18n } = useTranslation();
  const isKo = i18n.language === 'ko';

  const name = isKo ? route.displayNameKo : route.displayName;
  const subName = isKo ? route.displayName : route.displayNameKo;
  const start = isKo ? route.startPointKo : route.startPoint;
  const end = isKo ? route.endPointKo : route.endPoint;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/route/${route.id}`);
    }
  };

  return (
    <Card onPress={handlePress}>
      <View style={styles.row}>
        <View style={styles.modeGlyph}>
          <IconBus size={22} color={colors.fg[2]} />
        </View>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
            <StatusPill level={route.verificationLevel} />
          </View>
          <KrLine style={styles.subName}>{subName}</KrLine>
          <Text style={styles.routeLine}>
            {start} → {end}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.metaText}>
              {route.firstBus} – {route.lastBus}
            </Text>
            {route.headway !== 'Unknown' && (
              <>
                <View style={styles.dot} />
                <Text style={styles.metaText}>{route.headway}</Text>
              </>
            )}
          </View>
        </View>
        <View style={styles.chevron}>
          <IconChevR size={16} color={colors.fg[4]} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  modeGlyph: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.bg[3],
    borderWidth: 1,
    borderColor: colors.border[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 2,
  },
  name: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 17,
    lineHeight: 22,
    color: colors.fg[1],
    letterSpacing: -0.01 * 17,
    flex: 1,
  },
  subName: {
    marginBottom: 8,
  },
  routeLine: {
    fontFamily: 'Geist-Regular',
    fontSize: 13,
    lineHeight: 18,
    color: colors.fg[3],
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontFamily: 'GeistMono-Medium',
    fontSize: 12,
    lineHeight: 16,
    color: colors.fg[4],
    letterSpacing: 0.04 * 12,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 999,
    backgroundColor: colors.fg[5],
  },
  chevron: {
    paddingTop: 12,
  },
});
