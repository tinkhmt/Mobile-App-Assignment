import { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { login, loginAsGuest } from '../../api/auth';
import useAuthStore from '../../state/authStore';
import AppText from '../../components/AppText';
import ButtonPrimary from '../../components/ButtonPrimary';
import theme from '../../theme';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuthStore();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await login({ username, password });
      await setSession(data);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Languages' }],
      });
    } catch (error) {
      setLoading(false);
      alert(error.message || 'Login failed');
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      const data = await loginAsGuest();
      await setSession(data);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Languages' }],
      });
    } catch (error) {
      setLoading(false);
      alert(error.message || 'Guest login failed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="school" size={80} color={theme.colors.primary} />
        <AppText style={styles.appName}>S-Edu</AppText>
        {/* <AppText style={styles.tagline}>Language Learning for Everyone</AppText> */}
      </View>

      <View style={styles.formContainer}>
        {/* <AppText style={styles.title}>Welcome Back!</AppText> */}
        <AppText style={styles.subtitle}>Sign in to continue your learning journey</AppText>

        <View style={styles.inputContainer}>
          <Ionicons name="person" size={24} color={theme.colors.onSurfaceVariant} style={styles.inputIcon} />
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={24} color={theme.colors.onSurfaceVariant} style={styles.inputIcon} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <ButtonPrimary
          title={loading ? 'Signing in...' : 'Sign In'}
          onPress={handleLogin}
          disabled={loading}
          iconName="log-in"
        />

        <View style={styles.actionsRow}>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <AppText style={styles.link}>Create Account</AppText>
          </Pressable>
        </View>

      
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <AppText style={styles.dividerText}>or</AppText>
          <View style={styles.dividerLine} />
        </View>

        <ButtonPrimary
          title="Continue with Google"
          onPress={() => navigation.navigate('GoogleLogin')}
          style={styles.googleButton}
          iconName="logo-google"
        />

        <ButtonPrimary
          title="Continue as Guest"
          onPress={handleGuest}
          variant="secondary"
          iconName="person-outline"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
    paddingTop: 48
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20
  },
  appName: {
    marginTop: 12,
    ...theme.typography.headlineXL,
    color: theme.colors.primary
  },
  tagline: {
    marginTop: 4,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant
  },
  formContainer: {
    flex: 1
  },
  title: {
    ...theme.typography.headlineLG
  },
  subtitle: {
    marginTop: 8,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 32
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: theme.colors.outlineVariant
  },
  inputIcon: {
    paddingHorizontal: 16
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    paddingRight: 16,
    color: theme.colors.onSurface,
    ...theme.typography.bodyMD
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24
  },
  googleButton: {
    backgroundColor: '#DB4437',
    marginBottom: 16
  },
  link: {
    ...theme.typography.bodyMD,
    color: theme.colors.primary,
    fontWeight: '600'
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.outlineVariant
  },
  dividerText: {
    marginHorizontal: 16,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant
  }
});