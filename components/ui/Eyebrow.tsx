import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing } from '../../lib/design/tokens';

type EyebrowProps = {
  children: string;
  action?: string;
  onAction?: () => void;
};

export function Eyebrow({ children, action, onAction }: EyebrowProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
      {action && (
        <Pressable onPress={onAction}>
          <Text style={styles.action}>{action}</Text>
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
  text: {
    fontFamily: 'Geist-Medium',
    fontSize: 12,
    lineHeight: 16,
    color: colors.fg[3],
    letterSpacing: 0.10 * 12,
    textTransform: 'uppercase',
  },
  action: {
    fontFamily: 'Geist-Medium',
    fontSize: 12,
    lineHeight: 16,
    color: colors.accent.DEFAULT,
    letterSpacing: 0.04 * 12,
  },
});
