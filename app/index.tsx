"use client"

import { useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { Feather } from "@expo/vector-icons"
import { Screen, Title, Button, Card, Row, COLORS, SPACING } from "../components/UI"
import { BottomSheetAdjust } from "../components/BottomTabNavigator"

export default function Home() {
    const router = useRouter()
    const [hasGoals] = useState(false) // Toggle this to test both states
    const [sheetVisible, setSheetVisible] = useState(false)

    const handleDailyTweak = (minutes: number, focus: string) => {
        console.log("Daily tweak saved:", { minutes, focus })
    }

    if (!hasGoals) {
        return (
            <Screen>
                <View style={styles.emptyContainer}>
                    <Title children="Welcome to AI Daily Coach" />
                    <Text style={styles.emptyText}>Set 1–3 simple goals to get your daily coach.</Text>
                    <Button label="Start" onPress={() => router.push("/onboarding/language")} kind="primary" />
                </View>
            </Screen>
        )
    }

    return (
        <Screen scroll>
            <Title children="AI Daily Coach" />

            <Card>
                <Text style={styles.cardTitle}>Today</Text>
                <View style={styles.messageBlock}>
                    <Text style={styles.messageText}>Good morning! Here's your personalized plan for today:</Text>
                    <View style={styles.taskList}>
                        <View style={styles.taskItem}>
                            <Feather name="circle" size={16} color={COLORS.primary} />
                            <Text style={styles.taskText}>Read for 20 minutes (7:00 AM)</Text>
                        </View>
                        <View style={styles.taskItem}>
                            <Feather name="circle" size={16} color={COLORS.primary} />
                            <Text style={styles.taskText}>Complete deep work session (9:00 AM)</Text>
                        </View>
                    </View>
                </View>

                <Row gap={SPACING.sm}>
                    <Button
                        label="Regenerate"
                        onPress={() => console.log("Regenerate")}
                        kind="ghost"
                        icon={<Feather name="refresh-cw" size={18} color={COLORS.text} />}
                    />
                    <Button
                        label="Save"
                        onPress={() => console.log("Save")}
                        kind="secondary"
                        icon={<Feather name="bookmark" size={18} color={COLORS.bg} />}
                    />
                    <Button
                        label="Share"
                        onPress={() => console.log("Share")}
                        kind="ghost"
                        icon={<Feather name="share-2" size={18} color={COLORS.text} />}
                    />
                </Row>
            </Card>

            <View style={styles.tweakButton}>
                <Button
                    label="Daily Tweak"
                    onPress={() => setSheetVisible(true)}
                    kind="primary"
                    icon={<Feather name="sliders" size={18} color={COLORS.bg} />}
                />
            </View>

            <BottomSheetAdjust
                visible={sheetVisible}
                onClose={() => setSheetVisible(false)}
                onSave={handleDailyTweak}
                defaultMinutes={10}
                defaultFocus="reading"
            />
        </Screen>
    )
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        gap: SPACING.xl,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.sub,
        lineHeight: 24,
        marginBottom: SPACING.md,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    messageBlock: {
        marginBottom: SPACING.lg,
    },
    messageText: {
        fontSize: 15,
        color: COLORS.text,
        lineHeight: 22,
        marginBottom: SPACING.md,
    },
    taskList: {
        gap: SPACING.sm,
    },
    taskItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.sm,
    },
    taskText: {
        fontSize: 15,
        color: COLORS.text,
        flex: 1,
    },
    tweakButton: {
        marginTop: SPACING.xl,
    },
})
