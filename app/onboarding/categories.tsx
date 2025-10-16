import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/onboarding-store';

const FOCUS_AREAS = [
    { id: 'health', label: 'Health & Fitness', icon: '💪', color: '#10B981' },
    { id: 'study', label: 'Study & Learning', icon: '📚', color: '#3B82F6' },
    { id: 'work', label: 'Work & Career', icon: '💼', color: '#8B5CF6' },
    { id: 'finance', label: 'Finance & Money', icon: '💰', color: '#F59E0B' },
    { id: 'faith', label: 'Faith & Spirituality', icon: '🙏', color: '#EC4899' },
    { id: 'personal', label: 'Personal Growth', icon: '🌱', color: '#06B6D4' },
    { id: 'relationships', label: 'Relationships', icon: '❤️', color: '#EF4444' },
];

export default function FocusAreasScreen() {
    const router = useRouter();
    const { focusAreas, setFocusAreas } = useOnboarding();

    const handleToggle = (areaId: string) => {
        if (focusAreas.includes(areaId)) {
            // Remove area
            setFocusAreas(focusAreas.filter((id) => id !== areaId));
        } else {
            // Add area (max 3)
            if (focusAreas.length < 3) {
                setFocusAreas([...focusAreas, areaId]);
            }
        }
    };

    const handleContinue = () => {
        if (focusAreas.length > 0 && focusAreas.length <= 3) {
            router.push('/onboarding/quick');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>What matters to you?</Text>
                    <Text style={styles.subtitle}>
                        Choose up to 3 focus areas for your daily motivation
                    </Text>
                    <View style={styles.counter}>
                        <Text style={styles.counterText}>
                            {focusAreas.length} / 3 selected
                        </Text>
                    </View>
                </View>

                <View style={styles.grid}>
                    {FOCUS_AREAS.map((area) => {
                        const isSelected = focusAreas.includes(area.id);
                        const isDisabled = !isSelected && focusAreas.length >= 3;

                        return (
                            <TouchableOpacity
                                key={area.id}
                                style={[
                                    styles.card,
                                    isSelected && styles.cardSelected,
                                    isDisabled && styles.cardDisabled,
                                ]}
                                onPress={() => handleToggle(area.id)}
                                disabled={isDisabled}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.icon}>{area.icon}</Text>
                                <Text
                                    style={[
                                        styles.label,
                                        isSelected && styles.labelSelected,
                                        isDisabled && styles.labelDisabled,
                                    ]}
                                >
                                    {area.label}
                                </Text>
                                {isSelected && (
                                    <View style={[styles.badge, { backgroundColor: area.color }]}>
                                        <Text style={styles.badgeText}>✓</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        (focusAreas.length === 0 || focusAreas.length > 3) &&
                        styles.continueButtonDisabled,
                    ]}
                    onPress={handleContinue}
                    disabled={focusAreas.length === 0 || focusAreas.length > 3}
                    activeOpacity={0.8}
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
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
        marginBottom: 16,
    },
    counter: {
        backgroundColor: '#EFF6FF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    counterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2563EB',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    card: {
        width: '48%',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        minHeight: 140,
        justifyContent: 'center',
    },
    cardSelected: {
        backgroundColor: '#EFF6FF',
        borderColor: '#2563EB',
    },
    cardDisabled: {
        opacity: 0.4,
    },
    icon: {
        fontSize: 40,
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        textAlign: 'center',
    },
    labelSelected: {
        color: '#2563EB',
    },
    labelDisabled: {
        color: '#9CA3AF',
    },
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 12,
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
