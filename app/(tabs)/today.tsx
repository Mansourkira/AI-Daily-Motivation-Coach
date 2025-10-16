import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { supabaseService } from '@/services/supabase.service';
import { useCoach } from '@/contexts/store';

export default function TodayScreen() {
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const settings = useCoach((state) => state.settings);
    const goals = useCoach((state) => state.goals);

    useEffect(() => {
        loadPlan();
    }, []);

    const loadPlan = async () => {
        try {
            setLoading(true);
            const todayPlan = await supabaseService.getTodayPlan();

            if (!todayPlan) {
                // Create empty plan if doesn't exist
                await supabaseService.createEmptyPlanForToday();
                const newPlan = await supabaseService.getTodayPlan();
                setPlan(newPlan);
            } else {
                setPlan(todayPlan);
            }
        } catch (error: any) {
            console.error('Failed to load plan:', error);
            Alert.alert('Error', 'Failed to load today\'s plan. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGeneratePlan = () => {
        Alert.alert(
            'Coming Soon',
            'AI-powered plan generation will be available soon!',
            [{ text: 'OK' }]
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text style={styles.loadingText}>Loading today's plan...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const tasks = plan?.tasks || [];
    const hasTasks = tasks.length > 0;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hello, {settings?.name || 'there'}! 👋</Text>
                    <Text style={styles.date}>{formatDate(plan?.date || new Date().toISOString())}</Text>
                </View>

                {/* Active Goals Summary */}
                {goals.length > 0 && (
                    <View style={styles.goalsSection}>
                        <Text style={styles.sectionTitle}>Your Active Goals</Text>
                        <View style={styles.goalsList}>
                            {goals.filter(g => !g.archivedAt).slice(0, 3).map((goal) => (
                                <View key={goal.id} style={styles.goalCard}>
                                    <Text style={styles.goalIcon}>🎯</Text>
                                    <Text style={styles.goalText}>{goal.text}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Today's Plan */}
                <View style={styles.planSection}>
                    <Text style={styles.sectionTitle}>Today's Plan</Text>

                    {hasTasks ? (
                        <View style={styles.tasksList}>
                            {tasks.map((task: any, index: number) => (
                                <View key={task.id || index} style={styles.taskCard}>
                                    <View style={[styles.taskCheckbox, task.done && styles.taskCheckboxChecked]}>
                                        {task.done && <Text style={styles.checkmark}>✓</Text>}
                                    </View>
                                    <View style={styles.taskContent}>
                                        <Text style={[styles.taskText, task.done && styles.taskTextDone]}>
                                            {task.text}
                                        </Text>
                                        {task.at && (
                                            <Text style={styles.taskTime}>⏰ {task.at}</Text>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>📝</Text>
                            <Text style={styles.emptyText}>No tasks yet</Text>
                            <Text style={styles.emptyHint}>
                                Generate your personalized daily plan below
                            </Text>
                        </View>
                    )}
                </View>

                {/* Generate Plan Button */}
                <TouchableOpacity
                    style={[styles.generateButton, generating && styles.generateButtonDisabled]}
                    onPress={handleGeneratePlan}
                    disabled={generating}
                    activeOpacity={0.8}
                >
                    {generating ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            <Text style={styles.generateButtonIcon}>✨</Text>
                            <Text style={styles.generateButtonText}>Generate Today's Plan</Text>
                        </>
                    )}
                </TouchableOpacity>

                <Text style={styles.disclaimer}>
                    AI-powered plan generation coming soon
                </Text>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
    },
    header: {
        marginBottom: 32,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    date: {
        fontSize: 16,
        color: '#6B7280',
    },
    goalsSection: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 16,
    },
    goalsList: {
        gap: 12,
    },
    goalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        borderWidth: 1,
        borderColor: '#FCD34D',
        borderRadius: 12,
        padding: 16,
    },
    goalIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    goalText: {
        flex: 1,
        fontSize: 16,
        color: '#92400E',
        fontWeight: '500',
    },
    planSection: {
        marginBottom: 32,
    },
    tasksList: {
        gap: 12,
    },
    taskCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
    },
    taskCheckbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    taskCheckboxChecked: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    taskContent: {
        flex: 1,
    },
    taskText: {
        fontSize: 16,
        color: '#1F2937',
        marginBottom: 4,
    },
    taskTextDone: {
        textDecorationLine: 'line-through',
        color: '#9CA3AF',
    },
    taskTime: {
        fontSize: 14,
        color: '#6B7280',
    },
    emptyState: {
        alignItems: 'center',
        padding: 48,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 8,
    },
    emptyHint: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    generateButton: {
        flexDirection: 'row',
        backgroundColor: '#8B5CF6',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    generateButtonDisabled: {
        backgroundColor: '#D1D5DB',
        shadowOpacity: 0,
        elevation: 0,
    },
    generateButtonIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    generateButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    disclaimer: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 12,
        fontStyle: 'italic',
    },
});

