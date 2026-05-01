import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../../lib/design/tokens';
import { IconPin, IconClock, IconBus } from './icons';
import Svg, { Rect, Circle, Path } from 'react-native-svg';

type StepCardProps = {
  step: number;
  title: string;
  description: string;
  isKo?: boolean;
};

function StepIcon({ step }: { step: number }) {
  if (step === 1) return <IconPin size={20} color={colors.accent.DEFAULT} />;
  if (step === 2) return <IconClock size={20} color={colors.accent.DEFAULT} />;
  if (step === 3) return (
    <Svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={colors.accent.DEFAULT} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={6} y={3} width={12} height={18} rx={2} />
      <Path d="M9 7h6" />
      <Circle cx={12} cy={17} r={1.2} />
    </Svg>
  );
  return <IconBus size={20} color={colors.accent.DEFAULT} />;
}

export function StepCard({ step, title, description, isKo }: StepCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <StepIcon step={step} />
      </View>
      <Text style={styles.stepLabel}>STEP {String(step).padStart(2, '0')}</Text>
      <Text style={[styles.title, isKo && styles.titleKo]}>{title}</Text>
      <Text style={[styles.desc, isKo && styles.textKo]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '48%',
    backgroundColor: colors.bg[2],
    borderWidth: 1,
    borderColor: colors.border[1],
    borderRadius: radius.lg,
    padding: 16,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.bg[3],
    borderWidth: 1,
    borderColor: colors.border[2],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepLabel: {
    fontFamily: 'GeistMono-Medium',
    fontSize: 11,
    lineHeight: 14,
    color: colors.fg[4],
    letterSpacing: 0.06 * 11,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 15,
    lineHeight: 20,
    color: colors.fg[1],
    letterSpacing: -0.01 * 15,
    marginBottom: 4,
  },
  titleKo: {
    fontFamily: 'Pretendard-SemiBold',
  },
  desc: {
    fontFamily: 'Geist-Regular',
    fontSize: 13,
    lineHeight: 18,
    color: colors.fg[3],
  },
  textKo: {
    fontFamily: 'Pretendard-Regular',
  },
});
