import { Redirect } from 'expo-router';
import { useCoach } from '@/contexts/store';

export default function Index() {
    const onboardingDone = useCoach((state) => state.onboardingDone);

    // If onboarding is not done, redirect to onboarding
    if (!onboardingDone) {
        return <Redirect href="/onboarding/language" />;
    }

    // If onboarding is done, redirect to the today screen
    return <Redirect href="/(tabs)/today" />;
}

