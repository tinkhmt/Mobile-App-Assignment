import { View, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import ButtonPrimary from '../../components/ButtonPrimary';
import Card from '../../components/Card';
import ScreenHeader from '../../components/ScreenHeader';
import theme from '../../theme';

export default function VocabularyDetailScreen({ route, navigation }) {
  const { vocab, language } = route.params || {};

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
        title="Vocabulary"
        left={renderBackButton()}
        right={renderHomeButton()}
      />

      <View style={styles.wordContainer}>
        <AppText style={styles.title}>{vocab?.word || 'Vocabulary'}</AppText>
        <View style={styles.typeBadge}>
          <AppText style={styles.typeText}>{vocab?.type || 'Noun'}</AppText>
        </View>
      </View>

      {vocab?.imageUrl ? (
        <Image source={{ uri: vocab.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={80} color={theme.colors.onSurfaceVariant} />
        </View>
      )}

      <Card style={styles.card} accentColor={theme.colors.primary}>
        <View style={styles.sectionHeader}>
          <Ionicons name="book" size={28} color={theme.colors.primary} />
          <AppText style={styles.sectionTitle}>Definition</AppText>
        </View>
        <AppText style={styles.bodyText}>{vocab?.meaning || 'No definition available'}</AppText>
      </Card>

      <Card style={styles.card} accentColor={theme.colors.secondary}>
        <View style={styles.sectionHeader}>
          <Ionicons name="chatbubble" size={28} color={theme.colors.secondary} />
          <AppText style={styles.sectionTitle}>Example</AppText>
        </View>
        <AppText style={styles.bodyText}>
          Use "{vocab?.word || 'word'}" in a sentence to reinforce meaning.
        </AppText>
      </Card>

      <ButtonPrimary
        title="Practice This Word"
        onPress={() => navigation.navigate('Quiz', { topicId: vocab?.topicId, topic: vocab, language })}
        iconName="fitness"
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
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    ...theme.typography.headlineXL
  },
  typeBadge: {
    marginLeft: 16,
    backgroundColor: theme.colors.surfaceContainerLow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.full
  },
  typeText: {
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: theme.radius.xl,
    marginBottom: 24
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  card: {
    marginBottom: 20
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    marginLeft: 12,
    ...theme.typography.labelLG,
    color: theme.colors.onSurface
  },
  bodyText: {
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 32
  }
});