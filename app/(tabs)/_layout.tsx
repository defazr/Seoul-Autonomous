import { Tabs } from 'expo-router';
import { colors } from '../../lib/design/tokens';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg[1],
          borderTopColor: colors.bg[3],
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.fg[2],
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="routes" options={{ title: 'Routes' }} />
      <Tabs.Screen name="how-to-ride" options={{ title: 'How to Ride' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
