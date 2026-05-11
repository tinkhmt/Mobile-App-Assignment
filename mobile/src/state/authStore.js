import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { getMySubscription } from '../api/subscription';

const USER_KEY = 'sedu-user';
const TOKEN_KEY = 'sedu-token';

let navigateRef = null;

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  subscription: null,
  initializing: true,
  setSession: async (session) => {
    const { token, ...user } = session || {};
    if (token) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user || {}));
    set({ user: user || null, token: token || null });
  },
  setSubscription: (subscription) => {
    set({ subscription });
  },
  clearSession: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    set({ user: null, token: null, subscription: null });
  },
  hydrate: async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const userRaw = await AsyncStorage.getItem(USER_KEY);
    const user = userRaw ? JSON.parse(userRaw) : null;
    
    let subscription = null;
    if (token) {
      try {
        subscription = await getMySubscription();
      } catch (error) {
        console.log('Failed to fetch subscription:', error.message);
      }
    }
    
    set({ user, token, subscription, initializing: false });
  },
  setNavigateRef: (nav) => {
    navigateRef = nav;
  },
  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    set({ user: null, token: null, subscription: null });
    if (navigateRef) {
      navigateRef.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  }
}));

export default useAuthStore;
