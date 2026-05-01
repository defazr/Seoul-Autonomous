import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../lib/design/tokens';

export default function RoutesScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
    fontFamily: 'Geist-Bold',
    color: colors.fg[1],
    fontSize: 24,
  },
  subtitle: {
    fontFamily: 'Geist-Regular',
    color: colors.fg[3],
    fontSize: 14,
    marginTop: 8,
  },
});
