import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../../lib/design/tokens';
import { IconSparkle, IconQR, IconCheck, IconSensor } from './icons';

type HeroCardProps = {
  title: string;
  description: string;
  bullets: string[];
  isKo?: boolean;
};

const BULLET_ICONS = [
  <IconQR key="qr" size={14} color={colors.accent.DEFAULT} />,
  <IconCheck key="check" size={14} color={colors.accent.DEFAULT} />,
  <IconSensor key="sensor" size={14} color={colors.accent.DEFAULT} />,
];

export function HeroCard({ title, description, bullets, isKo }: HeroCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <IconSparkle size={12} color={colors.accent.DEFAULT} />
        <Text style={styles.badgeText}>START HERE</Text>
      </View>
      <Text style={[styles.title, isKo && styles.titleKo]}>{title}</Text>
      <Text style={[styles.desc, isKo && styles.textKo]}>{description}</Text>
      <View style={styles.bullets}>
        {bullets.map((text, i) => (
          <View key={i} style={styles.bulletRow}>
            <View style={styles.bulletIcon}>
              {BULLET_ICONS[i] || BULLET_ICONS[0]}
            </View>
            <Text style={[styles.bulletText, isKo && styles.textKo]}>{text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg[2],
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.25)',
    borderRadius: 14,
    padding: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.4)',
    backgroundColor: colors.accent.faint,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: 'GeistMono-Medium',
    fontSize: 11,
    lineHeight: 14,
    color: colors.accent.DEFAULT,
    letterSpacing: 0.08 * 11,
  },
  title: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 24,
    lineHeight: 28,
    color: colors.fg[1],
    letterSpacing: -0.02 * 24,
    marginBottom: 12,
  },
  titleKo: {
    fontFamily: 'Pretendard-SemiBold',
  },
  desc: {
    fontFamily: 'Geist-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: colors.fg[3],
    marginBottom: 16,
  },
  textKo: {
    fontFamily: 'Pretendard-Regular',
  },
  bullets: {
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  bulletIcon: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: 'rgba(0,212,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletText: {
    flex: 1,
    fontFamily: 'Geist-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.fg[2],
  },
});
