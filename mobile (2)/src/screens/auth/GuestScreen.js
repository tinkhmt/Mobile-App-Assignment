import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import ButtonPrimary from '../../components/ButtonPrimary';
import ScreenHeader from '../../components/ScreenHeader';
import { loginAsGuest } from '../../api/auth';
import useAuthStore from '../../state/authStore';
import theme from '../../theme';

export default function GuestScreen({ navigation }) {
  const { setSession } = useAuthStore();

  const handleGuest = async () => {
    try {
      const data = await loginAsGuest();
      await setSession(data);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Languages' }],
      });
    } catch (error) {
      alert(error.message || 'Guest login failed');
    }
  };

  const renderBackButton = () => (
    <Pressable onPress={() => navigation.goBack()} style={styles.navButton}>
      <Ionicons name="arrow-back" size={28} color={theme.colors.primary} />
    </Pressable>
  );

  const renderHomeButton = () => (
    <Pressable onPress={() => navigation.navigate('Home')} style={styles.navButton}>
      <Ionicons name="home" size={28} color={theme.colors.primary} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Guest Mode"
        left={renderBackButton()}
        right={renderHomeButton()}
      />

      <View style={styles.content}>
        <Ionicons name="person-circle-outline" size={100} color={theme.colors.primary} />
        <AppText style={styles.title}>Continue as Guest</AppText>
        <AppText style={styles.subtitle}>
          You can explore lessons and take quizzes without an account.
        </AppText>
        <ButtonPrimary 
          title="Start Learning" 
          onPress={handleGuest} 
          iconName="arrow-forward"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 24
  },
  navButton: {
    padding: 8
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    marginTop: 24,
    ...theme.typography.headlineLG
  },
  subtitle: {
    marginTop: 12,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20
  }
});