import api, { unwrap } from './client';

export function getAvailablePlans() {
  return unwrap(api.get('/api/v1/subscriptions/plans'));
}

export function getMySubscription() {
  return unwrap(api.get('/api/v1/subscriptions/me'));
}

export function purchaseSubscription(plan, paymentMethod) {
  return unwrap(api.post('/api/v1/subscriptions/purchase', { plan, paymentMethod }));
}

export function cancelSubscription() {
  return unwrap(api.post('/api/v1/subscriptions/cancel'));
}

export function getSubscriptionHistory() {
  return unwrap(api.get('/api/v1/subscriptions/history'));
}