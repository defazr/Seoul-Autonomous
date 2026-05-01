import { View, StyleSheet } from 'react-native';

type StatusDotProps = {
  color?: string;
  size?: number;
};

export function StatusDot({ color = '#00D4FF', size = 6 }: StatusDotProps) {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size,
          backgroundColor: color,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    // Pulse animation would need Animated API; static for now
  },
});
