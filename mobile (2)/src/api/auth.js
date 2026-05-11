import api, { unwrap } from './client';

export function login(payload) {
  return unwrap(api.post('/api/v1/auth/login', payload));
}

export function register(payload) {
  return unwrap(api.post('/api/v1/auth/register', payload));
}

export function loginWithGoogle(payload) {
  return unwrap(api.post('/api/v1/auth/google', payload));
}

export function loginAsGuest() {
  return unwrap(api.post('/api/v1/auth/guest'));
}

export function logout() {
  return unwrap(api.post('/api/v1/auth/logout'));
}
