import { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getVocabulariesByTopic } from '../../api/learning';
import AppText from '../../components/AppText';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import ButtonPrimary from '../../components/ButtonPrimary';
import theme from '../../theme';

export default function VocabularyListScreen({ route, navigation }) {
  const { topic, language } = route.params || {};
  const [vocabularies, setVocabularies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getVocabulariesByTopic(topic?.id);
        setVocabularies(data || []);
      } catch (error) {
        alert(error.message || 'Failed to load vocabulary');
      } finally {
        setLoading(false);
      }
    };
    if (topic?.id) {
      load();
    }
  }, [topic]);

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
    <View style={styles.container}>
      <ScreenHeader
        title={topic?.name || 'Vocabulary'}
        subtitle={topic ? `${vocabularies.length} words to learn` : ''}
        left={renderBackButton()}
        right={renderHomeButton()}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass" size={48} color={theme.colors.onSurfaceVariant} />
          <AppText style={styles.loading}>Loading vocabulary...</AppText>
        </View>
      ) : vocabularies.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="book-outline" size={48} color={theme.colors.onSurfaceVariant} />
          <AppText style={styles.loading}>No vocabulary in this topic yet.</AppText>
        </View>
      ) : (
        <FlatList
          data={vocabularies}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Card style={styles.lessonCard} accentColor={theme.colors.primary}>
              <View style={styles.lessonHeader}>
                <Ionicons name="school" size={36} color={theme.colors.primary} />
                <View style={styles.lessonText}>
                  <AppText style={styles.lessonTitle}>Lesson Overview</AppText>
                  <AppText style={styles.lessonBody}>
                    Practice {vocabularies.length} words with audio and visuals.
                  </AppText>
                </View>
              </View>
              <ButtonPrimary
                title="Start Learning"
                onPress={() => navigation.navigate('Lesson', { topic, language })}
                iconName="play"
              />
            </Card>
          }
          renderItem={({ item, index }) => {
            const colors = [theme.colors.primary, theme.colors.secondary, theme.colors.tertiary, theme.colors.accent];
            const accentColor = colors[index % colors.length];
            return (
              <Pressable
                onPress={() => navigation.navigate('VocabularyDetail', { vocab: item, language })}
              >
                <Card style={styles.vocabCard} accentColor={accentColor}>
                  <View style={styles.vocabRow}>
                    {item.imageUrl ? (
                      <Image source={{ uri: item.imageUrl }} style={styles.vocabImage} />
                    ) : (
                      <View style={[styles.vocabImagePlaceholder, { backgroundColor: accentColor }]}>
                        <Ionicons name="image" size={24} color="#FFFFFF" />
                      </View>
                    )}
                    <View style={styles.vocabInfo}>
                      <AppText style={styles.vocabWord}>{item.word}</AppText>
                      <AppText style={styles.vocabMeaning}>{item.meaning}</AppText>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={theme.colors.onSurfaceVariant} />
                  </View>
                </Card>
              </Pressable>
            );
          }}
        />
      )}
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
  list: {
    paddingBottom: 24
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loading: {
    marginTop: 16,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant
  },
  lessonCard: {
    marginBottom: 20
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  lessonText: {
    marginLeft: 16,
    flex: 1
  },
  lessonTitle: {
    ...theme.typography.headlineMD
  },
  lessonBody: {
    marginTop: 4,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant
  },
  vocabCard: {
    marginBottom: 16
  },
  vocabRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  vocabImage: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.lg
  },
  vocabImagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  vocabInfo: {
    flex: 1,
    marginLeft: 16
  },
  vocabWord: {
    ...theme.typography.headlineMD
  },
  vocabMeaning: {
    marginTop: 4,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant
  }
});