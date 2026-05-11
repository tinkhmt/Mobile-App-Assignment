import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import Card from '../../components/Card';
import ScreenHeader from '../../components/ScreenHeader';
import theme from '../../theme';

const FUNCTIONS = [
  {
    id: 'vocabulary',
    title: 'Vocabulary',
    body: 'Browse all words in this topic',
    icon: 'book',
    color: theme.colors.primary,
    navigateTo: 'VocabularyList'
  },
  {
    id: 'quiz',
    title: 'Quiz',
    body: 'Test your knowledge',
    icon: 'help-circle',
    color: theme.colors.secondary,
    navigateTo: 'Quiz'
  },
  {
    id: 'speaking',
    title: 'Speaking Practice',
    body: 'Practice pronunciation',
    icon: 'mic',
    color: theme.colors.tertiary,
    navigateTo: 'Quiz' // Temporary - reuse QuizScreen
  }
];

export default function TopicDetailScreen({ route, navigation }) {
  const { topic, language } = route.params || {};

  const renderBackButton = () => (
    <Pressable onPress={() => navigation.goBack()} style={styles.navButton}>
      <Ionicons name="arrow-back" size={28} color={theme.colors.primary} />
    </Pressable>
  );

  const renderHomeButton = () => (
    <Pressable onPress={() => navigation.navigate('Topics', { language })} style={styles.navButton}>
      <Ionicons name="home" size={28} color={theme.colors.primary} />
    </Pressable>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        title={topic?.name || 'Topic'}
        subtitle="Choose an activity to start"
        left={renderBackButton()}
        right={renderHomeButton()}
      />

      {FUNCTIONS.map((func) => (
        <Card 
          key={func.id} 
          style={styles.functionCard} 
          accentColor={func.color}
        >
          <Pressable 
            style={styles.cardPressable}
            onPress={() => navigation.navigate(func.navigateTo, { topicId: topic?.id, topic, language })}
          >
            <View style={[styles.iconContainer, { backgroundColor: func.color }]}>
              <Ionicons name={func.icon} size={32} color="#FFFFFF" />
            </View>
            <View style={styles.cardContent}>
              <AppText style={styles.cardTitle}>{func.title}</AppText>
              <AppText style={styles.cardBody}>{func.body}</AppText>
            </View>
            <Ionicons name="chevron-forward" size={28} color={theme.colors.onSurfaceVariant} />
          </Pressable>
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
  navButton: {
    padding: 8
  },
  functionCard: {
    marginBottom: 16
  },
  cardPressable: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardContent: {
    flex: 1,
    marginLeft: 16
  },
  cardTitle: {
    ...theme.typography.headlineMD
  },
  cardBody: {
    marginTop: 4,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant
  }
});