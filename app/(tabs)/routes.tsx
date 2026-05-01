import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../lib/design/tokens';

export default function RoutesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Routes</Text>
      <Text style={styles.subtitle}>10 fixed routes + 1 on-demand service</Text>
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
  title: {
    color: colors.fg[0],
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.fg[1],
    fontSize: 14,
    marginTop: 8,
  },
});
