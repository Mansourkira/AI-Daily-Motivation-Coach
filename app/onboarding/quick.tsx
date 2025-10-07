"use client"

import { useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Screen, Title, Button, Input, SPACING, COLORS } from "../../components/UI"
import { ChipGroup } from "../../components/Chips"
import { useCoach } from "@/contexts/store"

// Template goals based on categories
const TEMPLATES: Record<string, string[]> = {
    health: ["Exercise 3x/week", "Drink 8 glasses of water", "Sleep 8 hours"],
    study: ["Study 1 hour daily", "Read 1 chapter/day", "Practice coding"],
    work: ["Complete project tasks", "Attend all meetings", "Review emails"],
    finance: ["Track expenses", "Save 20% income", "Review budget weekly"],
    faith: ["Pray daily", "Read scripture", "Attend services"],
    personal: ["Journal daily", "Meditate 10 min", "Learn new skill"],
    relationships: ["Call family weekly", "Date night", "Connect with friends"],
}

export default function QuickScreen() {
    const router = useRouter()
    const { cats } = useLocalSearchParams()
    const { addGoal } = useCoach()
    const categories = typeof cats === "string" ? cats.split(",") : []

    const templateGoals = categories.flatMap((cat) => TEMPLATES[cat] || [])

    const [selectedTemplates, setSelectedTemplates] = useState<string[]>([])
    const [customGoal, setCustomGoal] = useState("")

    const handleToggle = (goal: string) => {
        if (selectedTemplates.includes(goal)) {
            setSelectedTemplates(selectedTemplates.filter((g) => g !== goal))
        } else if (selectedTemplates.length < 3) {
            setSelectedTemplates([...selectedTemplates, goal])
        }
    }

    const handleReview = () => {
        // Add selected template goals to store
        selectedTemplates.forEach(goal => addGoal(goal))
        
        // Add custom goal if provided
        if (customGoal.trim()) {
            addGoal(customGoal.trim())
        }
        
        router.push("/onboarding/review")
    }

    const totalSelected = selectedTemplates.length + (customGoal.trim() ? 1 : 0)

    return (
        <Screen scroll>
            <Title children="Pick or write up to 3 goals" subtitle="Choose from suggestions or create your own" />

            {templateGoals.length > 0 && (
                <View style={styles.section}>
                    <ChipGroup options={templateGoals} selected={selectedTemplates} onToggle={handleToggle} />
                </View>
            )}

            <View style={styles.section}>
                <Input value={customGoal} onChangeText={setCustomGoal} placeholder="Write your own goal..." maxLength={80} />
                <Text style={styles.hint}>Short and clear</Text>
            </View>

            <Button label="Review" onPress={handleReview} kind="primary" disabled={totalSelected === 0} />
        </Screen>
    )
}

const styles = StyleSheet.create({
    section: {
        marginBottom: SPACING.xl,
    },
    hint: {
        fontSize: 13,
        color: COLORS.sub,
        marginTop: SPACING.xs,
    },
})
