import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing } from '../../lib/design/tokens';
import { IconChevR } from './icons';

type SectionHeaderProps = {
  title: string;
  action?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {action && (
        <Pressable onPress={onAction} style={styles.actionWrap}>
          <Text style={styles.action}>{action}</Text>
          <IconChevR size={14} color={colors.fg[3]} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 20,
    lineHeight: 24,
    color: colors.fg[1],
    letterSpacing: -0.02 * 20,
  },
  actionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  action: {
    fontFamily: 'Geist-Medium',
    fontSize: 13,
    lineHeight: 18,
    color: colors.fg[3],
  },
});
