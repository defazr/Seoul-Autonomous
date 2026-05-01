import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../lib/design/tokens';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Language, theme, about</Text>
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
