import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
    Alert,
    ActivityIndicator,
    Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/onboarding-store';
import { useCoach } from '@/contexts/store';
import { supabaseService } from '@/services/supabase.service';

const FOCUS_AREA_LABELS: Record<string, string> = {
    health: 'Health & Fitness',
    study: 'Study & Learning',
    work: 'Work & Career',
    finance: 'Finance & Money',
    faith: 'Faith & Spirituality',
    personal: 'Personal Growth',
    relationships: 'Relationships',
};

export default function ReviewScreen() {
    const router = useRouter();
    const { locale, focusAreas, goals, name, notifications, setName, setNotifications, reset } = useOnboarding();
    const { setOnboardingDone } = useCoach();
    const [loading, setLoading] = useState(false);

    const handleFinish = async () => {
        if (!name.trim()) {
            Alert.alert('Missing Information', 'Please enter your name.');
            return;
        }

        try {
            setLoading(true);

            // 1. Ensure authentication
            await supabaseService.ensureAuth();

            // 2. Upsert profile and settings
            await supabaseService.upsertProfileAndSettings({
                name: name.trim(),
                locale,
                wake_time: '07:00',
                focus_areas: focusAreas,
                notifications,
                ads_consent: 'not_set',
            });

            // 3. Add all goals
            for (const goal of goals) {
                await supabaseService.addGoal(goal.text);
            }

            // 4. Create empty plan for today
            await supabaseService.createEmptyPlanForToday();

            // 5. Mark onboarding as done
            await setOnboardingDone(true);

            // 6. Reset onboarding temp state
            reset();

            // 7. Navigate to today screen
            Alert.alert(
                'Welcome! 🎉',
                `Great job, ${name.trim()}! Your profile is all set up.`,
                [
                    {
                        text: 'Get Started',
                        onPress: () => router.replace('/(tabs)'),
                    },
                ],
                { cancelable: false }
            );
        } catch (error: any) {
            console.error('Onboarding finish error:', error);
            Alert.alert(
                'Setup Error',
                error.message || 'Failed to complete setup. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Review & Finish</Text>
                    <Text style={styles.subtitle}>Let's review your choices</Text>
                </View>

                {/* Language */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Language</Text>
                    <View style={styles.valueCard}>
                        <Text style={styles.valueText}>
                            {locale === 'en' ? 'English' : locale === 'fr' ? 'Français' : 'العربية'}
                        </Text>
                    </View>
                </View>

                {/* Focus Areas */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Focus Areas ({focusAreas.length})</Text>
                    <View style={styles.chips}>
                        {focusAreas.map((area) => (
                            <View key={area} style={styles.chip}>
                                <Text style={styles.chipText}>{FOCUS_AREA_LABELS[area] || area}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Goals */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Your Goals ({goals.length})</Text>
                    <View style={styles.goalsList}>
                        {goals.map((goal, index) => (
                            <View key={index} style={styles.goalCard}>
                                <Text style={styles.goalNumber}>{index + 1}</Text>
                                <Text style={styles.goalText}>{goal.text}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Name Input */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>What should we call you?</Text>
                    <TextInput
                        style={styles.nameInput}
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={setName}
                        maxLength={50}
                        autoCapitalize="words"
                    />
                </View>

                {/* Notifications Toggle */}
                <View style={styles.section}>
                    <View style={styles.toggleRow}>
                        <View style={styles.toggleInfo}>
                            <Text style={styles.toggleLabel}>Enable Notifications</Text>
                            <Text style={styles.toggleDescription}>
                                Get daily reminders and motivation
                            </Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                            thumbColor={notifications ? '#2563EB' : '#F3F4F6'}
                        />
                    </View>
                </View>

                {/* Finish Button */}
                <TouchableOpacity
                    style={[styles.finishButton, loading && styles.finishButtonDisabled]}
                    onPress={handleFinish}
                    disabled={loading || !name.trim()}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.finishButtonText}>Finish & Get Today's Plan</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
    section: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    valueCard: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
    },
    valueText: {
        fontSize: 16,
        color: '#4B5563',
    },
    chips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#2563EB',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2563EB',
    },
    goalsList: {
        gap: 12,
    },
    goalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
    },
    goalNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2563EB',
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 32,
        marginRight: 12,
    },
    goalText: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    nameInput: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1F2937',
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
    },
    toggleInfo: {
        flex: 1,
        marginRight: 16,
    },
    toggleLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    toggleDescription: {
        fontSize: 14,
        color: '#6B7280',
    },
    finishButton: {
        backgroundColor: '#10B981',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        marginTop: 8,
    },
    finishButtonDisabled: {
        backgroundColor: '#D1D5DB',
        shadowOpacity: 0,
        elevation: 0,
    },
    finishButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});
