import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { useFonts, PublicSans_700Bold, PublicSans_600SemiBold } from '@expo-google-fonts/public-sans';
import { Lexend_400Regular, Lexend_600SemiBold } from '@expo-google-fonts/lexend';
import AppNavigator from './src/navigation/AppNavigator';
import useAuthStore from './src/state/authStore';
import theme from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    PublicSans_700Bold,
    PublicSans_600SemiBold,
    Lexend_400Regular,
    Lexend_600SemiBold
  });
  const { hydrate, initializing } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!fontsLoaded || initializing) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.background
        }}
      >
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="dark" />
    </>
  );
}
