import { Stack, Redirect } from 'expo-router';
import { useCoach } from '@/contexts/store';

export default function RootLayout() {
  const { onboardingDone } = useCoach();

  if (onboardingDone === undefined) {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  if (!onboardingDone) {
    return <Redirect href="/onboarding/language" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
