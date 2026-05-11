import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import ButtonPrimary from '../../components/ButtonPrimary';
import theme from '../../theme';
import useAuthStore from '../../state/authStore';

const ACTION_CARDS = [
  {
    id: 'vocabulary',
    title: 'Vocabulary',
    body: 'Learn and review new words today',
    icon: 'book',
    color: theme.colors.primary,
    route: 'Languages'
  },
  {
    id: 'quizzes',
    title: 'Quizzes',
    body: 'Test your knowledge with fun games',
    icon: 'help-circle',
    color: theme.colors.secondary,
    route: 'Languages'
  },
  {
    id: 'speaking',
    title: 'Speaking Practice',
    body: 'Practice pronunciation out loud',
    icon: 'mic',
    color: theme.colors.tertiary,
    route: 'Lesson'
  }
];

export default function HomeScreen({ navigation }) {
  const { user, clearSession } = useAuthStore();
  const [greeting, setGreeting] = useState('Welcome back');

  useEffect(() => {
    if (user?.username) {
      setGreeting(`Welcome back, ${user.username}!`);
    }
  }, [user]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        title={greeting}
        right={
          <Pressable onPress={clearSession} style={styles.logoutButton}>
            <Ionicons name="log-out" size={24} color={theme.colors.primary} />
            <AppText style={styles.logout}>Logout</AppText>
          </Pressable>
        }
      />

      <Card style={styles.progressCard} accentColor={theme.colors.primary}>
        <View style={styles.progressContent}>
          <Ionicons name="trophy" size={48} color={theme.colors.warning} />
          <View style={styles.progressText}>
            <AppText style={styles.progressTitle}>Keep up the great work!</AppText>
            <AppText style={styles.progressSubtitle}>Start learning today</AppText>
          </View>
        </View>
      </Card>

      <AppText style={styles.sectionTitle}>Choose Your Next Step</AppText>

      {ACTION_CARDS.map((card) => (
        <Card key={card.id} style={styles.actionCard} accentColor={card.color}>
          <View style={styles.actionCardContent}>
            <View style={[styles.iconContainer, { backgroundColor: card.color }]}>
              <Ionicons name={card.icon} size={32} color="#FFFFFF" />
            </View>
            <View style={styles.actionTextContainer}>
              <AppText style={styles.actionTitle}>{card.title}</AppText>
              <AppText style={styles.actionBody}>{card.body}</AppText>
            </View>
          </View>
          <ButtonPrimary
            title={`Go to ${card.title}`}
            onPress={() => navigation.navigate(card.route)}
            variant={card.id === 'vocabulary' ? 'primary' : card.id === 'quizzes' ? 'secondary' : 'tertiary'}
            iconName="arrow-forward"
          />
        </Card>
      ))}
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
    paddingBottom: 48
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logout: {
    marginLeft: 6,
    ...theme.typography.bodyMD,
    color: theme.colors.primary
  },
  progressCard: {
    marginBottom: 28
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  progressText: {
    marginLeft: 16,
    flex: 1
  },
  progressTitle: {
    ...theme.typography.headlineMD
  },
  progressSubtitle: {
    marginTop: 4,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant
  },
  sectionTitle: {
    marginBottom: 20,
    ...theme.typography.headlineMD
  },
  actionCard: {
    marginBottom: 20
  },
  actionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionTextContainer: {
    marginLeft: 16,
    flex: 1
  },
  actionTitle: {
    ...theme.typography.headlineMD
  },
  actionBody: {
    marginTop: 4,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant
  }
});