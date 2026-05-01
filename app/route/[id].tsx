import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, spacing } from '../../lib/design/tokens';

export default function RouteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Route Detail</Text>
      <Text style={styles.routeId}>{id}</Text>
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
  routeId: {
    color: colors.accent,
    fontSize: 16,
    marginTop: 8,
  },
});
