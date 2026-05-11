import { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import ButtonPrimary from '../../components/ButtonPrimary';
import ScreenHeader from '../../components/ScreenHeader';
import theme from '../../theme';
import { getVocabulariesByTopic } from '../../api/learning';

export default function LessonScreen({ route, navigation }) {
  const { topic, language } = route.params || {};
  const [vocabularies, setVocabularies] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getVocabulariesByTopic(topic?.id);
        setVocabularies(data || []);
      } catch (error) {
        alert(error.message || 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };
    if (topic?.id) {
      load();
    }
  }, [topic]);

  const current = vocabularies[index];
  const progress = vocabularies.length > 0 ? ((index + 1) / vocabularies.length) * 100 : 0;

  const handleNext = () => {
    if (index + 1 >= vocabularies.length) {
      navigation.navigate('TopicDetail', { topic, language });
    } else {
      setIndex((prev) => prev + 1);
    }
  };

  const renderBackButton = () => (
    <Pressable onPress={() => navigation.goBack()} style={styles.navButton}>
      <Ionicons name="arrow-back" size={28} color={theme.colors.primary} />
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title={topic?.name || 'Lesson'}
          left={renderBackButton()}
        />
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass" size={64} color={theme.colors.primary} />
          <AppText style={styles.loadingTitle}>Loading Lesson...</AppText>
        </View>
      </View>
    );
  }

  if (vocabularies.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title={topic?.name || 'Lesson'}
          left={renderBackButton()}
        />
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle" size={64} color={theme.colors.onSurfaceVariant} />
          <AppText style={styles.loadingTitle}>No Vocabulary Found</AppText>
          <AppText style={styles.loadingText}>No vocabulary available for this topic.</AppText>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        title={topic?.name || 'Lesson'}
        left={renderBackButton()}
      />

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <AppText style={styles.progressText}>Word {index + 1} of {vocabularies.length}</AppText>
      </View>

      <View style={styles.wordCard}>
        {current?.imageUrl ? (
          <Image source={{ uri: current.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={80} color={theme.colors.onSurfaceVariant} />
          </View>
        )}
        <AppText style={styles.word}>{current?.word || '...'}</AppText>
        <AppText style={styles.meaning}>{current?.meaning || ''}</AppText>
        <View style={styles.typeBadge}>
          <AppText style={styles.typeText}>{current?.type?.toUpperCase() || 'Noun'}</AppText>
        </View>
      </View>

      <View style={styles.audioButton}>
        <ButtonPrimary
          title="Play Audio"
          onPress={() => {}}
          variant="secondary"
          iconName="volume-high"
        />
      </View>

      <ButtonPrimary
        title={index + 1 >= vocabularies.length ? 'Done' : 'Next Word'}
        onPress={handleNext}
        iconName={index + 1 >= vocabularies.length ? 'checkmark-circle' : 'arrow-forward'}
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
    justifyContent: 'center'
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
    height: 10,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 5,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 5
  },
  progressText: {
    marginTop: 8,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center'
  },
  wordCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.radius.xl,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  image: {
    width: 200,
    height: 160,
    borderRadius: theme.radius.lg,
    marginBottom: 20
  },
  imagePlaceholder: {
    width: 200,
    height: 160,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  word: {
    ...theme.typography.headlineXL,
    textAlign: 'center'
  },
  meaning: {
    marginTop: 12,
    ...theme.typography.headlineMD,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center'
  },
  typeBadge: {
    marginTop: 16,
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: theme.radius.full
  },
  typeText: {
    ...theme.typography.bodyMD,
    color: theme.colors.onPrimary,
    fontWeight: '600'
  },
  audioButton: {
    marginBottom: 24
  }
});