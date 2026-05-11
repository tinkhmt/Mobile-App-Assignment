import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAvailablePlans, purchaseSubscription, getMySubscription, cancelSubscription } from '../../api/subscription';
import AppText from '../../components/AppText';
import ButtonPrimary from '../../components/ButtonPrimary';
import Card from '../../components/Card';
import ScreenHeader from '../../components/ScreenHeader';
import theme from '../../theme';
import useAuthStore from '../../state/authStore';

const PAYMENT_METHODS = [
  { id: 'VIETQR', name: 'VietQR', icon: 'qr-code' }
];

export default function SubscriptionScreen({ navigation }) {
  const { subscription, setSubscription } = useAuthStore();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentStep, setPaymentStep] = useState('plans'); // 'plans', 'payment', 'confirmation'
  const [paymentData, setPaymentData] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await getAvailablePlans();
      setPlans(data || []);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setPaymentStep('payment');
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;
    
    setPurchasing(true);
    try {
      const response = await purchaseSubscription(selectedPlan.name, 'VIETQR');
      setPaymentData(response);
      setPaymentStep('confirmation');
    } catch (error) {
      Alert.alert('Error', error.message || 'Payment failed');
    } finally {
      setPurchasing(false);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      const sub = await getMySubscription();
      setSubscription(sub);
      Alert.alert('Success', 'Subscription activated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to verify subscription');
    }
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelSubscription();
              await loadPlans();
              const sub = await getMySubscription();
              setSubscription(sub);
              Alert.alert('Success', 'Subscription cancelled');
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to cancel');
            }
          }
        }
      ]
    );
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const renderBackButton = () => (
    <Pressable onPress={() => {
      if (paymentStep === 'confirmation') {
        setPaymentStep('payment');
      } else if (paymentStep === 'payment') {
        setPaymentStep('plans');
        setSelectedPlan(null);
      } else {
        navigation.goBack();
      }
    }} style={styles.navButton}>
      <Ionicons name="arrow-back" size={28} color={theme.colors.primary} />
    </Pressable>
  );

  const getStepTitle = () => {
    switch (paymentStep) {
      case 'payment': return 'Select Payment';
      case 'confirmation': return 'Payment';
      default: return 'Premium Plans';
    }
  };

  const renderPlans = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <AppText style={styles.subtitle}>Choose the plan that works for you</AppText>
      
      {plans.map((plan, index) => {
        const isActive = subscription?.plan?.name === plan.name;
        const isPremium = plan.name !== 'FREE';
        
        return (
          <Card 
            key={plan.name} 
            style={[styles.planCard, isPremium && styles.premiumCard]}
            accentColor={isPremium ? theme.colors.primary : theme.colors.surfaceVariant}
          >
            <View style={styles.planHeader}>
              <View>
                <AppText style={styles.planName}>
                  {plan.displayName}
                  {index === 1 && ' ⭐'}
                  {index === 2 && ' 💎'}
                </AppText>
                <AppText style={styles.planPrice}>{formatPrice(plan.priceVND)}</AppText>
              </View>
              {isActive && (
                <View style={styles.currentBadge}>
                  <AppText style={styles.currentBadgeText}>Current</AppText>
                </View>
              )}
            </View>
            
            <View style={styles.benefitsList}>
              {plan.benefits?.map((benefit, i) => (
                <View key={i} style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
                  <AppText style={styles.benefitText}>{benefit}</AppText>
                </View>
              ))}
            </View>

            {isActive ? (
              isPremium ? (
                <ButtonPrimary
                  title="Cancel Subscription"
                  onPress={handleCancelSubscription}
                  variant="tertiary"
                  iconName="close-circle"
                />
              ) : null
            ) : (
              <ButtonPrimary
                title={isPremium ? 'Select' : 'Current Plan'}
                onPress={() => handleSelectPlan(plan)}
                disabled={isPremium === false}
                iconName={isPremium ? 'checkmark-circle' : 'checkmark'}
              />
            )}
          </Card>
        );
      })}
    </ScrollView>
  );

  const renderPayment = () => (
    <View style={styles.paymentContainer}>
      <View style={styles.summaryCard}>
        <AppText style={styles.summaryTitle}>Order Summary</AppText>
        <View style={styles.summaryRow}>
          <AppText style={styles.summaryLabel}>Plan</AppText>
          <AppText style={styles.summaryValue}>{selectedPlan?.displayName}</AppText>
        </View>
        <View style={styles.summaryRow}>
          <AppText style={styles.summaryLabel}>Price</AppText>
          <AppText style={styles.summaryValue}>{formatPrice(selectedPlan?.priceVND)}</AppText>
        </View>
      </View>

      <AppText style={styles.paymentTitle}>Payment Method</AppText>
      
      <Card style={styles.paymentMethodCard}>
        <View style={styles.paymentMethodRow}>
          <Ionicons name="qr-code" size={32} color={theme.colors.primary} />
          <View style={styles.paymentMethodInfo}>
            <AppText style={styles.paymentMethodName}>VietQR</AppText>
            <AppText style={styles.paymentMethodDesc}>Scan QR to pay</AppText>
          </View>
          <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
        </View>
      </Card>

      <ButtonPrimary
        title={purchasing ? 'Processing...' : 'Pay Now'}
        onPress={handlePayment}
        disabled={purchasing}
        iconName="cash"
      />
    </View>
  );

  const renderConfirmation = () => (
    <View style={styles.confirmationContainer}>
      <AppText style={styles.confirmTitle}>Scan QR to Pay</AppText>
      
      {paymentData?.qrCodeUrl && (
        <Image 
          source={{ uri: paymentData.qrCodeUrl }} 
          style={styles.qrCode}
          resizeMode="contain"
        />
      )}

      <View style={styles.paymentDetails}>
        <View style={styles.detailRow}>
          <AppText style={styles.detailLabel}>Amount</AppText>
          <AppText style={styles.detailValue}>{formatPrice(paymentData?.amount)}</AppText>
        </View>
        <View style={styles.detailRow}>
          <AppText style={styles.detailLabel}>Transaction</AppText>
          <AppText style={styles.detailValue}>{paymentData?.transactionId}</AppText>
        </View>
      </View>

      <ButtonPrimary
        title="I've Paid"
        onPress={handleConfirmPayment}
        iconName="checkmark-circle"
      />

      <Pressable 
        style={styles.cancelLink}
        onPress={() => {
          setPaymentStep('plans');
          setSelectedPlan(null);
          setPaymentData(null);
        }}
      >
        <AppText style={styles.cancelLinkText}>Cancel</AppText>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={getStepTitle()}
        left={renderBackButton()}
      />

      {paymentStep === 'plans' && renderPlans()}
      {paymentStep === 'payment' && renderPayment()}
      {paymentStep === 'confirmation' && renderConfirmation()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  navButton: {
    padding: 8
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48
  },
  subtitle: {
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 24,
    textAlign: 'center'
  },
  planCard: {
    marginBottom: 16,
    padding: 20
  },
  premiumCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  planName: {
    ...theme.typography.headlineMD
  },
  planPrice: {
    ...theme.typography.titleLG,
    color: theme.colors.primary,
    marginTop: 4
  },
  currentBadge: {
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.radius.full
  },
  currentBadgeText: {
    ...theme.typography.bodySM,
    color: theme.colors.primary,
    fontWeight: '600'
  },
  benefitsList: {
    marginBottom: 16
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  benefitText: {
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 8,
    flex: 1
  },
  paymentContainer: {
    flex: 1,
    padding: 24
  },
  summaryCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    padding: 20,
    marginBottom: 24
  },
  summaryTitle: {
    ...theme.typography.titleMD,
    marginBottom: 16
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  summaryLabel: {
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant
  },
  summaryValue: {
    ...theme.typography.bodyMD,
    fontWeight: '600'
  },
  paymentTitle: {
    ...theme.typography.titleMD,
    marginBottom: 16
  },
  paymentMethodCard: {
    padding: 16,
    marginBottom: 24
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  paymentMethodInfo: {
    flex: 1,
    marginLeft: 16
  },
  paymentMethodName: {
    ...theme.typography.headlineMD
  },
  paymentMethodDesc: {
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant
  },
  confirmationContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center'
  },
  confirmTitle: {
    ...theme.typography.headlineMD,
    marginBottom: 24
  },
  qrCode: {
    width: 250,
    height: 250,
    marginBottom: 24,
    backgroundColor: '#fff'
  },
  paymentDetails: {
    width: '100%',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    padding: 20,
    marginBottom: 24
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  detailLabel: {
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant
  },
  detailValue: {
    ...theme.typography.bodyMD,
    fontWeight: '600'
  },
  cancelLink: {
    marginTop: 16
  },
  cancelLinkText: {
    ...theme.typography.bodyMD,
    color: theme.colors.error
  }
});