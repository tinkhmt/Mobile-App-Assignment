import { useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import Card from '../../components/Card';
import ButtonPrimary from '../../components/ButtonPrimary';
import ScreenHeader from '../../components/ScreenHeader';
import theme from '../../theme';
import { submitTestResult } from '../../api/quiz';
import useAuthStore from '../../state/authStore';

export default function QuizResultScreen({ route, navigation }) {
  const { questions, answers, topicId, topic, language } = route.params || {};
  const { user } = useAuthStore();

  const result = useMemo(() => {
    const total = questions?.length || 0;
    const correct = questions?.reduce((count, q) => {
      return answers?.[q.id] === q.correctOptionIndex ? count + 1 : count;
    }, 0);
    const percentage = total ? Math.round((correct / total) * 100) : 0;
    return { total, correct, percentage };
  }, [questions, answers]);

  useEffect(() => {
    const submit = async () => {
      if (!result.total) return;
      try {
        await submitTestResult({
          deviceId: user?.id || 'guest',
          topicId,
          score: result.correct,
          totalQuestions: result.total,
          percentage: result.percentage
        });
      } catch (error) {
        console.log('Submit result failed', error.message);
      }
    };
    submit();
  }, [result, topicId, user]);

  const getScoreColor = () => {
    if (result.percentage >= 80) return theme.colors.success;
    if (result.percentage >= 60) return theme.colors.warning;
    return theme.colors.error;
  };

  const getScoreIcon = () => {
    if (result.percentage >= 80) return 'trophy';
    if (result.percentage >= 60) return 'thumbs-up';
    return 'school';
  };

  const renderBackButton = () => (
    <Pressable onPress={() => navigation.goBack()} style={styles.navButton}>
      <Ionicons name="arrow-back" size={28} color={theme.colors.primary} />
    </Pressable>
  );

  const renderHomeButton = () => (
    <Pressable 
      onPress={() => navigation.navigate('TopicDetail', { topic, language })} 
      style={styles.navButton}
    >
      <Ionicons name="home" size={28} color={theme.colors.primary} />
    </Pressable>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        title="Quiz Result"
        left={renderBackButton()}
        right={renderHomeButton()}
      />

      <View style={styles.scoreContainer}>
        <View style={[styles.scoreCircle, { borderColor: getScoreColor() }]}>
          <Ionicons name={getScoreIcon()} size={64} color={getScoreColor()} />
        </View>
        <AppText style={[styles.title, { color: getScoreColor() }]}>
          {result.percentage >= 80 ? 'Excellent!' : result.percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}
        </AppText>
        <AppText style={styles.score}>{result.correct} / {result.total}</AppText>
        <AppText style={styles.percentage}>{result.percentage}% Correct</AppText>
      </View>

      <Card style={styles.card} accentColor={theme.colors.primary}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={32} color={theme.colors.success} />
            <AppText style={styles.statValue}>{result.correct}</AppText>
            <AppText style={styles.statLabel}>Correct</AppText>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="close-circle" size={32} color={theme.colors.error} />
            <AppText style={styles.statValue}>{result.total - result.correct}</AppText>
            <AppText style={styles.statLabel}>Incorrect</AppText>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="analytics" size={32} color={theme.colors.primary} />
            <AppText style={styles.statValue}>{result.percentage}%</AppText>
            <AppText style={styles.statLabel}>Accuracy</AppText>
          </View>
        </View>
      </Card>

      <View style={styles.messageContainer}>
        <AppText style={styles.message}>
          {result.percentage >= 80 
            ? 'Amazing! You\'re doing great with your language learning!'
            : result.percentage >= 60 
            ? 'Good work! Keep practicing to improve even more!'
            : 'Don\'t give up! Practice makes perfect.'}
        </AppText>
      </View>

      <View style={styles.actions}>
        <ButtonPrimary 
          title="Try Again" 
          onPress={() => navigation.navigate('Quiz', { 
            topicId: topicId,
            resetKey: Date.now(),
            language
          })} 
          iconName="refresh"
        />
        <Pressable 
          onPress={() => navigation.navigate('TopicDetail', { topic, language })}
          style={styles.homeButton}
        >
          <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
          <AppText style={styles.homeText}>Done</AppText>
        </Pressable>
      </View>
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
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 32
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    marginBottom: 20
  },
  title: {
    ...theme.typography.headlineLG,
    marginBottom: 8
  },
  score: {
    ...theme.typography.headlineXL,
    color: theme.colors.onSurface
  },
  percentage: {
    marginTop: 8,
    ...theme.typography.headlineMD,
    color: theme.colors.onSurfaceVariant
  },
  card: {
    marginBottom: 24
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    marginTop: 8,
    ...theme.typography.headlineMD
  },
  statLabel: {
    marginTop: 4,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant
  },
  messageContainer: {
    padding: 20,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    marginBottom: 28
  },
  message: {
    ...theme.typography.bodyLG,
    color: theme.colors.onSurface,
    textAlign: 'center'
  },
  actions: {
    gap: 16
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary
  },
  homeText: {
    marginLeft: 10,
    ...theme.typography.bodyMD,
    color: theme.colors.primary
  }
});