import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import API_BASE_URL from './config';
import useAuthStore from '../state/authStore';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('sedu-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export async function unwrap(promise) {
  const response = await promise;
  const payload = response?.data;
  if (!payload?.success) {
    const message = payload?.message || 'Request failed';
    throw new Error(message);
  }
  return payload.data;
}

export default api;
