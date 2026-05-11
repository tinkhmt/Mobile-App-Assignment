const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

export type BackendLanguage = {
  id: string;
  code: string;
  name: string;
};

export type BackendTopic = {
  id: string;
  languageId: string;
  name: string;
  isPremium: boolean;
};

export type BackendQuestion = {
  id: string;
  topicId: string;
  content: string;
  options: string[];
  correctOptionIndex: number;
  imageUrl?: string | null;
};

export type BackendSubscriptionPlan = {
  name: string;
  displayName: string;
  priceVND: number;
  benefits: string[];
};

export type BackendAdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  provider: string;
  plan: string;
  subscriptionActive: boolean;
  joinedAt: string;
  updatedAt: string;
};

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;
  return payload.data;
}

export function getLanguages() {
  return request<BackendLanguage[]>('/api/languages');
}

export function getTopics() {
  return request<BackendTopic[]>('/api/topics');
}

export function getQuestions() {
  return request<BackendQuestion[]>('/api/questions');
}

export function getSubscriptionPlans() {
  return request<BackendSubscriptionPlan[]>('/api/v1/subscriptions/plans');
}

export function getAdminUsers() {
  return request<BackendAdminUser[]>('/api/admin/users');
}
