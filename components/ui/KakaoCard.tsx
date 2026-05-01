import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../../lib/design/tokens';
import { KrLine } from './KrLine';
import Svg, { Rect, Path } from 'react-native-svg';

type KakaoCardProps = {
  title: string;
  titleKr?: string;
  steps: string[];
  note: string;
  isKo?: boolean;
};

function PhoneIcon() {
  return (
    <Svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={6} y={2} width={12} height={20} rx={2.5} />
      <Path d="M11 18h2" />
    </Svg>
  );
}

export function KakaoCard({ title, titleKr, steps, note, isKo }: KakaoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <PhoneIcon />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, isKo && styles.titleKo]}>{title}</Text>
          {titleKr && !isKo && <KrLine>{titleKr}</KrLine>}
        </View>
      </View>
      <View style={styles.steps}>
        {steps.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{i + 1}</Text>
            </View>
            <Text style={[styles.stepText, isKo && styles.textKo]}>{step}</Text>
          </View>
        ))}
      </View>
      <Text style={[styles.note, isKo && styles.textKo]}>{note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg[2],
    borderWidth: 1,
    borderColor: colors.border[1],
    borderRadius: 14,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.accent.faint,
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.35)',
    color: colors.accent.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 16,
    lineHeight: 20,
    color: colors.fg[1],
    letterSpacing: -0.01 * 16,
  },
  titleKo: {
    fontFamily: 'Pretendard-SemiBold',
  },
  steps: {
    gap: 10,
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: colors.bg[3],
    borderWidth: 1,
    borderColor: colors.border[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontFamily: 'GeistMono-Medium',
    fontSize: 11,
    lineHeight: 14,
    color: colors.fg[2],
  },
  stepText: {
    flex: 1,
    fontFamily: 'Geist-Regular',
    fontSize: 13,
    lineHeight: 20,
    color: colors.fg[2],
    paddingTop: 1,
  },
  textKo: {
    fontFamily: 'Pretendard-Regular',
  },
  note: {
    fontFamily: 'Geist-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: colors.fg[4],
  },
});
