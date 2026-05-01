import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../lib/design/tokens';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Seoul Autonomous</Text>
      <Text style={styles.subtitle}>Try Seoul's autonomous future</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg[0],
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
  },
  headline: {
    color: colors.fg[0],
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.fg[1],
    fontSize: 16,
    marginTop: 8,
  },
});
