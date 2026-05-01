import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius } from '../../lib/design/tokens';

type CardProps = {
  children: React.ReactNode;
  live?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Card({ children, live, onPress, style }: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        live && styles.live,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg[2],
    borderWidth: 1,
    borderColor: colors.border[1],
    borderRadius: radius.lg,
    padding: 16,
  },
  live: {
    borderColor: 'rgba(0,212,255,0.55)',
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
});
