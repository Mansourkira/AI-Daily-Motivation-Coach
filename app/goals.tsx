import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface Goal {
    id: string;
    title: string;
    description: string;
    completed: boolean;
}

export default function GoalsScreen() {
    const { colors } = useTheme();
    const [goals, setGoals] = useState<Goal[]>([
        {
            id: '1',
            title: 'Daily Exercise',
            description: 'Exercise for at least 30 minutes every day',
            completed: false,
        },
        {
            id: '2',
            title: 'Learn New Skill',
            description: 'Spend 1 hour learning a new programming language',
            completed: true,
        },
    ]);
    const [newGoal, setNewGoal] = useState('');

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: 20,
            paddingTop: 20,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 20,
            fontFamily: 'System',
        },
        inputContainer: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.border,
        },
        input: {
            fontSize: 16,
            color: colors.text,
            fontFamily: 'System',
            marginBottom: 12,
        },
        addButton: {
            backgroundColor: colors.primary,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
            alignSelf: 'flex-start',
        },
        addButtonText: {
            color: '#ffffff',
            fontSize: 14,
            fontWeight: '600',
            fontFamily: 'System',
        },
        goalCard: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: 'row',
            alignItems: 'center',
        },
        goalContent: {
            flex: 1,
            marginLeft: 12,
        },
        goalTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 4,
            fontFamily: 'System',
        },
        goalDescription: {
            fontSize: 14,
            color: colors.textSecondary,
            fontFamily: 'System',
        },
        checkbox: {
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        checkboxCompleted: {
            backgroundColor: colors.success,
            borderColor: colors.success,
        },
        checkmark: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

    const toggleGoal = (id: string) => {
        setGoals(goals.map(goal =>
            goal.id === id ? { ...goal, completed: !goal.completed } : goal
        ));
    };

    const addGoal = () => {
        if (newGoal.trim()) {
            const goal: Goal = {
                id: Date.now().toString(),
                title: newGoal,
                description: '',
                completed: false,
            };
            setGoals([...goals, goal]);
            setNewGoal('');
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>My Goals</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a new goal..."
                    placeholderTextColor={colors.textSecondary}
                    value={newGoal}
                    onChangeText={setNewGoal}
                    onSubmitEditing={addGoal}
                />
                <TouchableOpacity style={styles.addButton} onPress={addGoal}>
                    <Text style={styles.addButtonText}>Add Goal</Text>
                </TouchableOpacity>
            </View>

            {goals.map((goal) => (
                <TouchableOpacity
                    key={goal.id}
                    style={styles.goalCard}
                    onPress={() => toggleGoal(goal.id)}
                >
                    <View style={[
                        styles.checkbox,
                        goal.completed && styles.checkboxCompleted
                    ]}>
                        {goal.completed && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <View style={styles.goalContent}>
                        <Text style={[
                            styles.goalTitle,
                            goal.completed && { textDecorationLine: 'line-through', opacity: 0.6 }
                        ]}>
                            {goal.title}
                        </Text>
                        {goal.description ? (
                            <Text style={[
                                styles.goalDescription,
                                goal.completed && { opacity: 0.6 }
                            ]}>
                                {goal.description}
                            </Text>
                        ) : null}
                    </View>
                </TouchableOpacity>
            ))}

            {goals.length === 0 && (
                <View style={styles.inputContainer}>
                    <Text style={styles.goalDescription}>
                        No goals yet. Add your first goal above to get started!
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}
