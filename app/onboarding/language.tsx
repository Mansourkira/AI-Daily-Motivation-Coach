import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding, Locale } from '@/contexts/onboarding-store';

const LANGUAGES = [
    { code: 'en' as Locale, label: 'English', flag: '🇬🇧' },
    { code: 'fr' as Locale, label: 'Français', flag: '🇫🇷' },
    { code: 'ar' as Locale, label: 'العربية', flag: '🇸🇦' },
];

export default function LanguageScreen() {
    const router = useRouter();
    const { locale, setLocale } = useOnboarding();

    const handleSelect = (selectedLocale: Locale) => {
        setLocale(selectedLocale);
    };

    const handleContinue = () => {
        if (locale) {
            router.push('/onboarding/categories');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Choose Your Language</Text>
                <Text style={styles.subtitle}>Select your preferred language</Text>

                <View style={styles.languageList}>
                    {LANGUAGES.map((lang) => (
                        <TouchableOpacity
                            key={lang.code}
                            style={[
                                styles.languageCard,
                                locale === lang.code && styles.languageCardSelected,
                            ]}
                            onPress={() => handleSelect(lang.code)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.flag}>{lang.flag}</Text>
                            <Text
                                style={[
                                    styles.languageLabel,
                                    locale === lang.code && styles.languageLabelSelected,
                                ]}
                            >
                                {lang.label}
                            </Text>
                            {locale === lang.code && (
                                <View style={styles.checkmark}>
                                    <Text style={styles.checkmarkText}>✓</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.continueButton, !locale && styles.continueButtonDisabled]}
                    onPress={handleContinue}
                    disabled={!locale}
                    activeOpacity={0.8}
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 48,
        textAlign: 'center',
    },
    languageList: {
        gap: 16,
        marginBottom: 48,
    },
    languageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    languageCardSelected: {
        backgroundColor: '#EFF6FF',
        borderColor: '#2563EB',
    },
    flag: {
        fontSize: 32,
        marginRight: 16,
    },
    languageLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4B5563',
        flex: 1,
    },
    languageLabelSelected: {
        color: '#2563EB',
    },
    checkmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmarkText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    continueButton: {
        backgroundColor: '#2563EB',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    continueButtonDisabled: {
        backgroundColor: '#D1D5DB',
        shadowOpacity: 0,
        elevation: 0,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});
