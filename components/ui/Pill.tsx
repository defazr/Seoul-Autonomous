import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../lib/design/tokens';

type PillProps = {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning';
};

const VARIANTS = {
  default: {
    color: colors.fg[2],
    borderColor: colors.border[2],
    backgroundColor: colors.bg[3],
  },
  accent: {
    color: colors.accent.DEFAULT,
    borderColor: 'rgba(0,212,255,0.4)',
    backgroundColor: colors.accent.faint,
  },
  success: {
    color: colors.status.success,
    borderColor: 'rgba(69,165,87,0.4)',
    backgroundColor: 'rgba(69,165,87,0.10)',
  },
  warning: {
    color: colors.status.warning,
    borderColor: 'rgba(255,178,36,0.4)',
    backgroundColor: 'rgba(255,178,36,0.10)',
  },
};

export function Pill({ children, variant = 'default' }: PillProps) {
  const v = VARIANTS[variant];
  return (
    <View style={[styles.pill, { borderColor: v.borderColor, backgroundColor: v.backgroundColor }]}>
      <Text style={[styles.text, { color: v.color }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  text: {
    fontFamily: 'Geist-Medium',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.08 * 11,
    textTransform: 'uppercase',
  },
});
