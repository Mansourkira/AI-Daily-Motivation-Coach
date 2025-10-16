import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="language" />
            <Stack.Screen name="categories" />
            <Stack.Screen name="quick" />
            <Stack.Screen name="review" />
        </Stack>
    );
}
