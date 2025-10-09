"use client"

import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useCoach } from "@/contexts/store"
import { useState } from "react"

export default function GoalsScreen() {
    const { goals, addGoal, removeGoal } = useCoach()
    const [newGoal, setNewGoal] = useState("")

    const handleAdd = () => {
        if (newGoal.trim() && goals.length < 3) {
            addGoal(newGoal.trim())
            setNewGoal("")
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Your Goals</Text>
            <Text style={styles.sub}>Manage your active goals (max 3)</Text>

            <View style={styles.goalsList}>
                {goals.map((goal) => (
                    <View key={goal.id} style={styles.goalCard}>
                        <Text style={styles.goalText}>{goal.text}</Text>
                        <TouchableOpacity onPress={() => removeGoal(goal.id)}>
                            <Feather name="trash-2" size={18} color="#ff4444" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {goals.length < 3 && (
                <View style={styles.addSection}>
                    <TextInput 
                        value={newGoal} 
                        onChangeText={setNewGoal} 
                        placeholder="Add a new goal..." 
                        maxLength={80}
                        style={styles.input}
                    />
                    <TouchableOpacity onPress={handleAdd} style={styles.addButton} disabled={!newGoal.trim()}>
                        <Text style={styles.addButtonText}>Add Goal</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    heading: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
    sub: { color: '#8A8F98', marginBottom: 20 },
    goalsList: { gap: 12, marginBottom: 24 },
    goalCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#f5f5f5', borderRadius: 12 },
    goalText: { fontSize: 16, flex: 1, marginRight: 12 },
    addSection: { gap: 12 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, fontSize: 16 },
    addButton: { backgroundColor: '#1f9d55', padding: 14, borderRadius: 12, alignItems: 'center' },
    addButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
})


