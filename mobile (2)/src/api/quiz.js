import api, { unwrap } from './client';

export function generateTest(payload) {
  return unwrap(api.post('/api/questions/generate-test', payload));
}

export function submitTestResult(payload) {
  return unwrap(api.post('/api/test-results', payload));
}
