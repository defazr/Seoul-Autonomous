import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../lib/design/tokens';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
    fontFamily: 'Geist-Bold',
    color: colors.fg[1],
    fontSize: 28,
  },
  subtitle: {
    fontFamily: 'Geist-Regular',
    color: colors.fg[3],
    fontSize: 16,
    marginTop: 8,
  },
});
