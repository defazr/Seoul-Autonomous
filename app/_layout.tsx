import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../lib/design/tokens';
import '../lib/i18n';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Geist-Regular': require('../assets/fonts/Geist-Regular.otf'),
    'Geist-Medium': require('../assets/fonts/Geist-Medium.otf'),
    'Geist-SemiBold': require('../assets/fonts/Geist-SemiBold.otf'),
    'Geist-Bold': require('../assets/fonts/Geist-Bold.otf'),
    'GeistMono-Medium': require('../assets/fonts/GeistMono-Medium.otf'),
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.otf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg[0], justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.accent.DEFAULT} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg[0] },
        }}
      />
    </>
  );
}
