import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logout as logoutApi } from '../../api/auth';
import { getMySubscription } from '../../api/subscription';
import AppText from '../../components/AppText';
import ButtonPrimary from '../../components/ButtonPrimary';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import theme from '../../theme';
import useAuthStore from '../../state/authStore';

export default function ProfileScreen({ navigation }) {
  const { user, subscription, setSubscription, clearSession } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      // Ignore API errors
    }
    await clearSession();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const handleManageSubscription = async () => {
    try {
      const sub = await getMySubscription();
      setSubscription(sub);
    } catch (error) {
      console.log('Failed to refresh subscription:', error.message);
    }
    navigation.navigate('Subscription');
  };

  const isPremium = subscription?.plan && subscription.plan !== 'FREE';
  const planName = subscription?.plan?.displayName || 'Free Plan';
  const endDate = subscription?.endDate 
    ? new Date(subscription.endDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }) 
    : null;

  const renderBackButton = () => (
    <Pressable onPress={() => navigation.goBack()} style={styles.navButton}>
      <Ionicons name="arrow-back" size={28} color={theme.colors.primary} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Profile"
        left={renderBackButton()}
      />

      <View style={styles.userSection}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={60} color={theme.colors.primary} />
        </View>
        <AppText style={styles.username}>{user?.username || 'Guest'}</AppText>
        <View style={[styles.planBadge, isPremium ? styles.premiumBadge : styles.freeBadge]}>
          <AppText style={[styles.planBadgeText, isPremium ? styles.premiumText : styles.freeText]}>
            {isPremium ? '⭐ ' : '🔒 '}{planName}
          </AppText>
        </View>
      </View>

      <View style={styles.subscriptionSection}>
        <AppText style={styles.sectionTitle}>My Subscription</AppText>
        
        {isPremium ? (
          <Card style={styles.subscriptionCard}>
            <View style={styles.subscriptionInfo}>
              <AppText style={styles.subscriptionPlan}>{planName}</AppText>
              {endDate && (
                <AppText style={styles.subscriptionExpiry}>Expires: {endDate}</AppText>
              )}
            </View>
            <ButtonPrimary
              title="Manage"
              onPress={handleManageSubscription}
              variant="secondary"
              iconName="settings-outline"
            />
          </Card>
        ) : (
          <Card style={styles.subscriptionCard}>
            <View style={styles.subscriptionInfo}>
              <AppText style={styles.subscriptionPlan}>Free Plan</AppText>
              <AppText style={styles.subscriptionLimits}>
                Limited to 5 topics per language
              </AppText>
            </View>
            <ButtonPrimary
              title="Upgrade"
              onPress={() => navigation.navigate('Subscription')}
              iconName="star"
            />
          </Card>
        )}
      </View>

      <View style={styles.bottomSection}>
        <ButtonPrimary
          title="Logout"
          onPress={handleLogout}
          variant="tertiary"
          iconName="log-out-outline"
        />
      </View>
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
  userSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  username: {
    ...theme.typography.headlineLG,
    marginBottom: 12
  },
  planBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: theme.radius.full
  },
  premiumBadge: {
    backgroundColor: theme.colors.primaryContainer
  },
  freeBadge: {
    backgroundColor: theme.colors.surfaceContainerLow
  },
  planBadgeText: {
    ...theme.typography.bodyMD,
    fontWeight: '600'
  },
  premiumText: {
    color: theme.colors.primary
  },
  freeText: {
    color: theme.colors.onSurfaceVariant
  },
  subscriptionSection: {
    marginBottom: 32
  },
  sectionTitle: {
    ...theme.typography.titleMD,
    marginBottom: 16
  },
  subscriptionCard: {
    padding: 20
  },
  subscriptionInfo: {
    marginBottom: 16
  },
  subscriptionPlan: {
    ...theme.typography.headlineMD,
    marginBottom: 4
  },
  subscriptionExpiry: {
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant
  },
  subscriptionLimits: {
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant
  },
  bottomSection: {
    marginTop: 'auto'
  }
});