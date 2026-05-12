import api, { unwrap } from './client';

export function getAvailablePlans() {
  return unwrap(api.get('/api/v1/subscriptions/plans'));
}

export function getMySubscription(token) {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  return unwrap(api.get('/api/v1/subscriptions/me', config));
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