import { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import ButtonPrimary from '../../components/ButtonPrimary';
import ScreenHeader from '../../components/ScreenHeader';
import { loginWithGoogle } from '../../api/auth';
import useAuthStore from '../../state/authStore';
import theme from '../../theme';

export default function GoogleLoginScreen({ navigation }) {
  const [idToken, setIdToken] = useState('');
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuthStore();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const data = await loginWithGoogle({ idToken });
      await setSession(data);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Languages' }],
      });
    } catch (error) {
      setLoading(false);
      alert(error.message || 'Google login failed');
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        title="Google Sign-In"
        left={renderBackButton()}
        right={renderHomeButton()}
      />

      <View style={styles.header}>
        <Ionicons name="logo-google" size={60} color={theme.colors.primary} />
        <AppText style={styles.title}>Sign in with Google</AppText>
        <AppText style={styles.subtitle}>Paste your Google ID token to sign in</AppText>
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="key" size={24} color={theme.colors.onSurfaceVariant} style={styles.inputIcon} />
        <TextInput
          value={idToken}
          onChangeText={setIdToken}
          placeholder="Google ID Token"
          placeholderTextColor={theme.colors.onSurfaceVariant}
          style={styles.input}
          multiline
        />
      </View>

      <ButtonPrimary
        title={loading ? 'Signing in...' : 'Sign In with Google'}
        onPress={handleGoogleLogin}
        disabled={loading || !idToken}
        iconName="logo-google"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    padding: 24,
    paddingTop: 16
  },
  navButton: {
    padding: 8
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20
  },
  title: {
    marginTop: 16,
    ...theme.typography.headlineLG
  },
  subtitle: {
    marginTop: 8,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: theme.colors.outlineVariant,
    alignItems: 'flex-start'
  },
  inputIcon: {
    paddingHorizontal: 16,
    paddingTop: 18
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    paddingRight: 16,
    minHeight: 120,
    color: theme.colors.onSurface,
    ...theme.typography.bodyMD
  }
});