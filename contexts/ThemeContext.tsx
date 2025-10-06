import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeColors {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
}

export interface ThemeContextType {
    theme: Theme;
    colors: ThemeColors;
    isDark: boolean;
    setTheme: (theme: Theme) => void;
}

const lightColors: ThemeColors = {
    background: '#ffffff',
    surface: '#f8f9fa',
    primary: '#007AFF',
    secondary: '#5856D6',
    text: '#1c1c1e',
    textSecondary: '#8e8e93',
    border: '#c7c7cc',
    error: '#ff3b30',
    success: '#34c759',
    warning: '#ff9500',
};

const darkColors: ThemeColors = {
    background: '#000000',
    surface: '#1c1c1e',
    primary: '#0a84ff',
    secondary: '#5e5ce6',
    text: '#ffffff',
    textSecondary: '#8e8e93',
    border: '#38383a',
    error: '#ff453a',
    success: '#30d158',
    warning: '#ff9f0a',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [theme, setThemeState] = useState<Theme>('system');
    const [isLoaded, setIsLoaded] = useState(false);

    const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');
    const colors = isDark ? darkColors : lightColors;

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('theme');
                if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
                    setThemeState(savedTheme as Theme);
                }
            } catch (error) {
                console.error('Error loading theme:', error);
            } finally {
                setIsLoaded(true);
            }
        };

        loadTheme();
    }, []);

    const setTheme = async (newTheme: Theme) => {
        try {
            await AsyncStorage.setItem('theme', newTheme);
            setThemeState(newTheme);
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    };

    if (!isLoaded) {
        return null; // or a loading component
    }

    return (
        <ThemeContext.Provider value={{ theme, colors, isDark, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
