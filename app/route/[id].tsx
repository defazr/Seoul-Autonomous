import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../lib/design/tokens';

export default function RouteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
    fontFamily: 'Geist-Bold',
    color: colors.fg[1],
    fontSize: 24,
  },
  routeId: {
    fontFamily: 'GeistMono-Medium',
    color: colors.accent.DEFAULT,
    fontSize: 16,
    marginTop: 8,
  },
});
