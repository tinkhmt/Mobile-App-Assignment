import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import Card from '../../components/Card';
import ButtonPrimary from '../../components/ButtonPrimary';
import OptionButton from '../../components/OptionButton';
import ScreenHeader from '../../components/ScreenHeader';
import theme from '../../theme';
import { generateTest } from '../../api/quiz';

export default function QuizScreen({ route, navigation }) {
  const { topicId, topic, language } = route.params || {};
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset quiz state when resetKey changes (new quiz attempt)
    if (route.params?.resetKey) {
      setIndex(0);
      setAnswers({});
    }
  }, [route.params?.resetKey]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await generateTest({ topicId, numberOfQuestions: 5 });
        setQuestions(data || []);
      } catch (error) {
        alert(error.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    if (topicId) {
      load();
    }
  }, [topicId, route.params?.resetKey]);

  const current = questions[index];

  const handleSelect = (optionIndex) => {
    setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }));
  };

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      navigation.navigate('QuizResult', { questions, answers, topicId, topic, language });
    } else {
      setIndex((prev) => prev + 1);
    }
  };

  const progress = questions.length > 0 ? ((index + 1) / questions.length) * 100 : 0;

  const renderBackButton = () => (
    <Pressable onPress={() => navigation.goBack()} style={styles.navButton}>
      <Ionicons name="arrow-back" size={28} color={theme.colors.primary} />
    </Pressable>
  );

  const renderHomeButton = () => (
    <Pressable 
      onPress={() => navigation.navigate(language ? 'Topics' : 'Languages', language ? { language } : undefined)} 
      style={styles.navButton}
    >
      <Ionicons name="home" size={28} color={theme.colors.primary} />
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Quiz"
          left={renderBackButton()}
          right={renderHomeButton()}
        />
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass" size={64} color={theme.colors.primary} />
          <AppText style={styles.loadingTitle}>Loading Quiz...</AppText>
          <AppText style={styles.loadingText}>Preparing your questions</AppText>
        </View>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Quiz"
          left={renderBackButton()}
          right={renderHomeButton()}
        />
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle" size={64} color={theme.colors.onSurfaceVariant} />
          <AppText style={styles.loadingTitle}>No Quiz Available</AppText>
          <AppText style={styles.loadingText}>No quiz questions available for this topic.</AppText>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        title="Quiz"
        left={renderBackButton()}
        right={renderHomeButton()}
      />

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <AppText style={styles.progressText}>Question {index + 1} of {questions.length}</AppText>
      </View>

      <Card style={styles.questionCard} accentColor={theme.colors.primary}>
        <View style={styles.questionHeader}>
          <Ionicons name="help-circle" size={32} color={theme.colors.primary} />
          <AppText style={styles.questionLabel}>Question</AppText>
        </View>
        <AppText style={styles.question}>{current?.content || '...'}</AppText>
      </Card>

      <View style={styles.optionsContainer}>
        {(current?.options || []).map((option, idx) => (
          <OptionButton
            key={option}
            label={option}
            selected={answers[current?.id] === idx}
            onPress={() => handleSelect(idx)}
          />
        ))}
      </View>

      <ButtonPrimary
        title={index + 1 >= questions.length ? 'Finish Quiz' : 'Next Question'}
        onPress={handleNext}
        disabled={answers[current?.id] === undefined}
        iconName={index + 1 >= questions.length ? 'checkmark-circle' : 'arrow-forward'}
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
    paddingBottom: 48
  },
  navButton: {
    padding: 8
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  loadingTitle: {
    marginTop: 20,
    ...theme.typography.headlineMD
  },
  loadingText: {
    marginTop: 8,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant
  },
  progressContainer: {
    marginBottom: 24
  },
  progressBar: {
    height: 12,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 6,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 6
  },
  progressText: {
    marginTop: 8,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center'
  },
  questionCard: {
    marginBottom: 28
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  questionLabel: {
    marginLeft: 10,
    ...theme.typography.labelLG,
    color: theme.colors.primary
  },
  question: {
    ...theme.typography.headlineMD
  },
  optionsContainer: {
    marginBottom: 28
  }
});