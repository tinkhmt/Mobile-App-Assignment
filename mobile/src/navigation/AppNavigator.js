import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import useAuthStore from '../state/authStore';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import GuestScreen from '../screens/auth/GuestScreen';
import GoogleLoginScreen from '../screens/auth/GoogleLoginScreen';
import LanguageSelectScreen from '../screens/learning/LanguageSelectScreen';
import TopicListScreen from '../screens/learning/TopicListScreen';
import TopicDetailScreen from '../screens/learning/TopicDetailScreen';
import VocabularyListScreen from '../screens/learning/VocabularyListScreen';
import VocabularyDetailScreen from '../screens/learning/VocabularyDetailScreen';
import LessonScreen from '../screens/learning/LessonScreen';
import QuizScreen from '../screens/quiz/QuizScreen';
import QuizResultScreen from '../screens/quiz/QuizResultScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SubscriptionScreen from '../screens/profile/SubscriptionScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token } = useAuthStore();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    useAuthStore.getState().setNavigateRef(navigationRef);
  }, [navigationRef]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={token ? 'Languages' : 'Login'}
      >
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Guest" component={GuestScreen} />
            <Stack.Screen name="GoogleLogin" component={GoogleLoginScreen} />
          </>
        ) : null}
        <Stack.Screen name="Languages" component={LanguageSelectScreen} />
        <Stack.Screen name="Topics" component={TopicListScreen} />
        <Stack.Screen name="TopicDetail" component={TopicDetailScreen} />
        <Stack.Screen name="VocabularyList" component={VocabularyListScreen} />
        <Stack.Screen name="VocabularyDetail" component={VocabularyDetailScreen} />
        <Stack.Screen name="Lesson" component={LessonScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="QuizResult" component={QuizResultScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}