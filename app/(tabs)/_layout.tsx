import { Tabs } from 'expo-router';
import { colors } from '../../lib/design/tokens';
import { IconHome, IconRoute, IconHelp, IconSettings } from '../../components/ui/icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(10,10,10,0.92)',
          borderTopColor: colors.border[1],
          borderTopWidth: 1,
          paddingTop: 8,
          height: 84,
        },
        tabBarActiveTintColor: colors.accent.DEFAULT,
        tabBarInactiveTintColor: colors.fg[3],
        tabBarLabelStyle: {
          fontFamily: 'Geist-Medium',
          fontSize: 10,
          letterSpacing: 0.02 * 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconHome size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="routes"
        options={{
          title: 'Routes',
          tabBarIcon: ({ color }) => <IconRoute size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="how-to-ride"
        options={{
          title: 'How to ride',
          tabBarIcon: ({ color }) => <IconHelp size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSettings size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
