"use client"
import { View, Text, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { Feather } from "@expo/vector-icons"
import { Screen, Title, Button, Card, SPACING, COLORS } from "../../components/UI"

// Mock goals for demo
const MOCK_GOALS = ["Exercise 3x/week", "Study 1 hour daily", "Track expenses"]

export default function ReviewScreen() {
    const router = useRouter()

    const handleFinish = () => {
        console.log("Onboarding complete")
        router.replace("/")
    }

    const handleBack = () => {
        router.back()
    }

    return (
        <Screen scroll>
            <Title children="Review & Save" subtitle="Your selected goals" />

            <Card>
                <View style={styles.goalsList}>
                    {MOCK_GOALS.map((goal, index) => (
                        <View key={index} style={styles.goalItem}>
                            <Feather name="check-circle" size={20} color={COLORS.primary} />
                            <Text style={styles.goalText}>{goal}</Text>
                        </View>
                    ))}
                </View>
            </Card>

            <View style={styles.actions}>
                <Button label="Finish & Get Today's Card" onPress={handleFinish} kind="primary" />
                <Button label="Back" onPress={handleBack} kind="ghost" />
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    goalsList: {
        gap: SPACING.md,
    },
    goalItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.sm,
    },
    goalText: {
        fontSize: 16,
        color: COLORS.text,
        flex: 1,
    },
    actions: {
        marginTop: SPACING.xl,
        gap: SPACING.md,
    },
})
