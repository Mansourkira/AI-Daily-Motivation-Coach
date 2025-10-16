import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/onboarding-store';
import { supabaseService } from '@/services/supabase.service';

export default function GoalsScreen() {
    const router = useRouter();
    const { focusAreas, goals, addGoal, removeGoal } = useOnboarding();
    const [suggestions, setSuggestions] = useState<Array<{ id: string; text: string; category: string }>>([]);
    const [customGoal, setCustomGoal] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSuggestions();
    }, [focusAreas]);

    const loadSuggestions = async () => {
        try {
            setLoading(true);
            const data = await supabaseService.getGoalSuggestions(focusAreas);
            setSuggestions(data);
        } catch (error: any) {
            console.error('Failed to load suggestions:', error);
            Alert.alert('Error', 'Failed to load goal suggestions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSuggestion = (text: string) => {
        const isSelected = goals.some((g) => g.text === text);
        if (isSelected) {
            removeGoal(text);
        } else {
            if (goals.length >= 3) {
                Alert.alert('Maximum Reached', 'You can only select up to 3 goals.');
                return;
            }
            addGoal(text, false);
        }
    };

    const handleAddCustomGoal = () => {
        const trimmed = customGoal.trim();
        if (!trimmed) {
            Alert.alert('Invalid Goal', 'Please enter a goal.');
            return;
        }

        if (goals.length >= 3) {
            Alert.alert('Maximum Reached', 'You can only add up to 3 goals.');
            return;
        }

        if (goals.some((g) => g.text === trimmed)) {
            Alert.alert('Duplicate Goal', 'This goal is already added.');
            return;
        }

        addGoal(trimmed, true);
        setCustomGoal('');
    };

    const handleContinue = () => {
        if (goals.length > 0 && goals.length <= 3) {
            router.push('/onboarding/review');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Set Your Goals</Text>
                    <Text style={styles.subtitle}>
                        Choose up to 3 goals that you want to achieve
                    </Text>
                    <View style={styles.counter}>
                        <Text style={styles.counterText}>
                            {goals.length} / 3 selected
                        </Text>
                    </View>
                </View>

                {/* Custom Goal Input */}
                <View style={styles.customGoalSection}>
                    <Text style={styles.sectionTitle}>Add a custom goal</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your goal..."
                            value={customGoal}
                            onChangeText={setCustomGoal}
                            onSubmitEditing={handleAddCustomGoal}
                            returnKeyType="done"
                            maxLength={100}
                        />
                        <TouchableOpacity
                            style={[styles.addButton, !customGoal.trim() && styles.addButtonDisabled]}
                            onPress={handleAddCustomGoal}
                            disabled={!customGoal.trim()}
                        >
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Selected Goals */}
                {goals.length > 0 && (
                    <View style={styles.selectedSection}>
                        <Text style={styles.sectionTitle}>Your goals</Text>
                        <View style={styles.selectedList}>
                            {goals.map((goal, index) => (
                                <View key={index} style={styles.selectedGoal}>
                                    <Text style={styles.selectedGoalText}>{goal.text}</Text>
                                    <TouchableOpacity
                                        onPress={() => removeGoal(goal.text)}
                                        style={styles.removeButton}
                                    >
                                        <Text style={styles.removeButtonText}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Suggestions */}
                <View style={styles.suggestionsSection}>
                    <Text style={styles.sectionTitle}>Suggested goals based on your interests</Text>
                    {loading ? (
                        <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
                    ) : suggestions.length > 0 ? (
                        <View style={styles.suggestionsList}>
                            {suggestions.map((suggestion) => {
                                const isSelected = goals.some((g) => g.text === suggestion.text);
                                const isDisabled = !isSelected && goals.length >= 3;

                                return (
                                    <TouchableOpacity
                                        key={suggestion.id}
                                        style={[
                                            styles.suggestionCard,
                                            isSelected && styles.suggestionCardSelected,
                                            isDisabled && styles.suggestionCardDisabled,
                                        ]}
                                        onPress={() => handleToggleSuggestion(suggestion.text)}
                                        disabled={isDisabled}
                                        activeOpacity={0.7}
                                    >
                                        <Text
                                            style={[
                                                styles.suggestionText,
                                                isSelected && styles.suggestionTextSelected,
                                            ]}
                                        >
                                            {suggestion.text}
                                        </Text>
                                        {isSelected && (
                                            <View style={styles.checkmark}>
                                                <Text style={styles.checkmarkText}>✓</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ) : (
                        <Text style={styles.noSuggestions}>
                            No suggestions available for your selected focus areas.
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        (goals.length === 0 || goals.length > 3) && styles.continueButtonDisabled,
                    ]}
                    onPress={handleContinue}
                    disabled={goals.length === 0 || goals.length > 3}
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
        marginBottom: 24,
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
    customGoalSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1F2937',
    },
    addButton: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonDisabled: {
        backgroundColor: '#D1D5DB',
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    selectedSection: {
        marginBottom: 24,
    },
    selectedList: {
        gap: 12,
    },
    selectedGoal: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        borderWidth: 2,
        borderColor: '#2563EB',
        borderRadius: 12,
        padding: 16,
    },
    selectedGoalText: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '500',
    },
    removeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#EF4444',
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    suggestionsSection: {
        marginBottom: 24,
    },
    loader: {
        marginVertical: 24,
    },
    suggestionsList: {
        gap: 12,
    },
    suggestionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
    },
    suggestionCardSelected: {
        backgroundColor: '#EFF6FF',
        borderColor: '#2563EB',
    },
    suggestionCardDisabled: {
        opacity: 0.4,
    },
    suggestionText: {
        flex: 1,
        fontSize: 16,
        color: '#4B5563',
    },
    suggestionTextSelected: {
        color: '#2563EB',
        fontWeight: '600',
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
    noSuggestions: {
        fontSize: 14,
        color: '#9CA3AF',
        fontStyle: 'italic',
        textAlign: 'center',
        marginVertical: 24,
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
