"use client"

import { useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { Feather } from "@expo/vector-icons"
import { Screen, Title, Button, Card, Input, Row, SPACING, COLORS } from "../components/UI"

const MOCK_GOALS = ["Exercise 3x/week", "Study 1 hour daily"]

export default function GoalsScreen() {
    const [goals, setGoals] = useState(MOCK_GOALS)
    const [newGoal, setNewGoal] = useState("")

    const handleAdd = () => {
        if (newGoal.trim() && goals.length < 3) {
            setGoals([...goals, newGoal.trim()])
            setNewGoal("")
        }
    }

    const handleArchive = (index: number) => {
        setGoals(goals.filter((_, i) => i !== index))
    }

    return (
        <Screen scroll>
            <Title children="Your Goals" subtitle="Manage your active goals" />

            <View style={styles.goalsList}>
                {goals.map((goal, index) => (
                    <Card key={index}>
                        <Row gap={SPACING.md}>
                            <Text style={styles.goalText}>{goal}</Text>
                            <Button
                                label=""
                                onPress={() => handleArchive(index)}
                                kind="ghost"
                                icon={<Feather name="trash-2" size={18} color={COLORS.danger} />}
                            />
                        </Row>
                    </Card>
                ))}
            </View>

            {goals.length < 3 && (
                <View style={styles.addSection}>
                    <Input value={newGoal} onChangeText={setNewGoal} placeholder="Add a new goal..." maxLength={80} />
                    <Button label="Add" onPress={handleAdd} kind="primary" disabled={!newGoal.trim()} />
                </View>
            )}

            <Text style={styles.infoText}>Max 3 active goals</Text>
        </Screen>
    )
}

const styles = StyleSheet.create({
    goalsList: {
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    goalText: {
        fontSize: 16,
        color: COLORS.text,
        flex: 1,
    },
    addSection: {
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.sub,
        textAlign: "center",
    },
})
