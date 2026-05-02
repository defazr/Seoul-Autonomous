import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../../lib/design/tokens';

type InfoCardItemProps = {
  label: string;
  value: string;
  accent?: boolean;
  isKo?: boolean;
};

export function InfoCardItem({ label, value, accent, isKo }: InfoCardItemProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, accent && styles.valueAccent, isKo && styles.valueKo]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.bg[2],
    borderWidth: 1,
    borderColor: colors.border[1],
    borderRadius: radius.lg,
    padding: 14,
  },
  label: {
    fontFamily: 'Geist-Medium',
    fontSize: 11,
    lineHeight: 14,
    color: colors.fg[3],
    letterSpacing: 0.08 * 11,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  value: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 18,
    lineHeight: 22,
    color: colors.fg[1],
    letterSpacing: -0.01 * 18,
  },
  valueAccent: {
    color: colors.accent.DEFAULT,
  },
  valueKo: {
    fontFamily: 'Pretendard-SemiBold',
  },
});
