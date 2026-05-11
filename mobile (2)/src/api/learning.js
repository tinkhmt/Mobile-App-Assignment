import api, { unwrap } from './client';

export function getLanguages() {
  return unwrap(api.get('/api/languages'));
}

export function getTopicsByLanguage(languageId) {
  return unwrap(api.get(`/api/topics/language/${languageId}`));
}

export function getVocabulariesByTopic(topicId) {
  return unwrap(api.get(`/api/vocabularies/topic/${topicId}`));
}

export function getVocabulary(id) {
  return unwrap(api.get(`/api/vocabularies/${id}`));
}
