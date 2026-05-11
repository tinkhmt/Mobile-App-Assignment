import { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { register } from '../../api/auth';
import AppText from '../../components/AppText';
import ButtonPrimary from '../../components/ButtonPrimary';
import ScreenHeader from '../../components/ScreenHeader';
import theme from '../../theme';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      await register({ username, email, password });
      alert('Account created. Please sign in.');
      navigation.navigate('Login');
    } catch (error) {
      setLoading(false);
      alert(error.message || 'Register failed');
    }
  };

  const renderBackButton = () => (
    <Pressable onPress={() => navigation.goBack()} style={styles.navButton}>
      <Ionicons name="arrow-back" size={28} color={theme.colors.primary} />
    </Pressable>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        title="Create Account"
        left={renderBackButton()}
      />

      <View style={styles.header}>
        <Ionicons name="person-add" size={60} color={theme.colors.primary} />
        <AppText style={styles.title}>Join S-Edu</AppText>
        <AppText style={styles.subtitle}>Start your language learning journey</AppText>
      </View>

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
        <Ionicons name="mail" size={24} color={theme.colors.onSurfaceVariant} style={styles.inputIcon} />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={theme.colors.onSurfaceVariant}
          keyboardType="email-address"
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
        title={loading ? 'Creating...' : 'Create Account'}
        onPress={handleRegister}
        disabled={loading}
        iconName="person-add"
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
    marginBottom: 16
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
  }
});