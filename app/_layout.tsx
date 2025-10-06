import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import BottomTabNavigator from '../components/BottomTabNavigator';

function RootLayoutNav() {
    const { colors } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.background,
                    },
                    headerTintColor: colors.text,
                    headerTitleStyle: {
                        fontFamily: 'System',
                        fontWeight: '600',
                    },
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: 'transparent',
                    },
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'Daily Coach',
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="goals"
                    options={{
                        title: 'Goals',
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="history"
                    options={{
                        title: 'History',
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="settings"
                    options={{
                        title: 'Settings',
                        headerShown: true,
                    }}
                />
            </Stack>
            <BottomTabNavigator />
            <StatusBar style="auto" />
        </View>
    );
}

export default function RootLayout() {
    return (
        <ThemeProvider>
            <RootLayoutNav />
        </ThemeProvider>
    );
}
