import { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTopicsByLanguage } from '../../api/learning';
import AppText from '../../components/AppText';
import Card from '../../components/Card';
import ScreenHeader from '../../components/ScreenHeader';
import ButtonPrimary from '../../components/ButtonPrimary';
import theme from '../../theme';
import useAuthStore from '../../state/authStore';

export default function TopicListScreen({ route, navigation }) {
  const { language } = route.params || {};
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTopicsByLanguage(language?.id);
        setTopics(data || []);
      } catch (error) {
        alert(error.message || 'Failed to load topics');
      } finally {
        setLoading(false);
      }
    };
    if (language?.id) {
      load();
    }
  }, [language]);

  const { subscription } = useAuthStore();
  const isPremiumUser = subscription?.plan && subscription.plan !== 'FREE';

  const handleTopicPress = (topic) => {
    if (topic.isPremium && !isPremiumUser) {
      Alert.alert(
        'Premium Content',
        'This is a premium topic. Upgrade to Premium to access this content.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Subscription') }
        ]
      );
      return;
    }
    navigation.navigate('TopicDetail', { topic, language });
  };

  const renderBackButton = () => (
    <Pressable onPress={() => navigation.navigate('Languages')} style={styles.navButton}>
      <Ionicons name="arrow-back" size={28} color={theme.colors.primary} />
    </Pressable>
  );

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const renderProfileButton = () => (
    <Pressable onPress={handleProfile} style={styles.navButton}>
      <Ionicons name="person-outline" size={28} color={theme.colors.primary} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={language?.name || 'Topics'}
        subtitle="Choose a topic to start"
        left={renderBackButton()}
        right={renderProfileButton()}
      />

      {!isPremiumUser && (
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Ionicons name="lock-closed" size={20} color={theme.colors.primary} />
            <AppText style={styles.bannerText}>Premium topics are locked</AppText>
          </View>
          <ButtonPrimary
            title="Upgrade to Premium"
            onPress={() => navigation.navigate('Subscription')}
            style={styles.bannerButton}
          />
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass" size={48} color={theme.colors.onSurfaceVariant} />
          <AppText style={styles.loading}>Loading topics...</AppText>
        </View>
      ) : topics.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="folder-open" size={48} color={theme.colors.onSurfaceVariant} />
          <AppText style={styles.loading}>No topics found for this language.</AppText>
        </View>
      ) : (
        <FlatList
          data={topics}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => {
            const colors = [theme.colors.primary, theme.colors.secondary, theme.colors.tertiary, theme.colors.accent];
            const accentColor = colors[index % colors.length];
            const isLocked = item.isPremium && !isPremiumUser;
            return (
              <Pressable
                onPress={() => handleTopicPress(item)}
              >
                <Card style={styles.topicCard} accentColor={isLocked ? theme.colors.surfaceVariant : accentColor}>
                  <View style={styles.topicContent}>
                    <View style={[styles.topicIcon, { backgroundColor: isLocked ? theme.colors.surfaceVariant : accentColor }]}>
                      <Ionicons name={isLocked ? 'lock-closed' : 'folder'} size={28} color="#FFFFFF" />
                    </View>
                    <View style={styles.topicText}>
                      <AppText style={styles.topicTitle}>{item.name}</AppText>
                      <AppText style={styles.topicSubtitle}>
                        {isLocked ? 'Premium content' : 'Tap to continue'}
                      </AppText>
                    </View>
                    <Ionicons name="chevron-forward" size={28} color={theme.colors.onSurfaceVariant} />
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
  banner: {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: theme.radius.lg,
    padding: 16,
    marginBottom: 16
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  bannerText: {
    ...theme.typography.bodyMD,
    color: theme.colors.onPrimaryContainer,
    marginLeft: 8,
    flex: 1
  },
  bannerButton: {
    backgroundColor: theme.colors.primary
  },
  list: {
    paddingTop: 16,
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
  topicCard: {
    marginBottom: 16
  },
  topicContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  topicIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  topicText: {
    marginLeft: 16,
    flex: 1
  },
  topicTitle: {
    ...theme.typography.headlineMD
  },
  topicSubtitle: {
    marginTop: 4,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant
  }
});