"use client"
import { View, Text, StyleSheet, TextInput, Switch } from "react-native"
import { useRouter } from "expo-router"
import { Feather } from "@expo/vector-icons"
import { useState } from "react"
import { Screen, Title, Button, Card, SPACING, COLORS } from "../../components/UI"
import { useCoach } from "@/contexts/store"
import { ensureNotificationPermission } from "@/services/notifications"

export default function ReviewScreen() {
    const router = useRouter()
    const { goals, setOnboardingDone, setSettings, settings } = useCoach()
    const [name, setName] = useState('')
    const [notifications, setNotifications] = useState(false)

    const handleFinish = async () => {
        setSettings({ name, notifications })
        if (notifications) await ensureNotificationPermission()
        setOnboardingDone(true)
        router.replace('/(tabs)')
    }

    const handleBack = () => {
        router.back()
    }

    return (
        <Screen scroll>
            <Title children="Review & Save" subtitle="Your selected goals" />

            <Card>
                <View style={styles.goalsList}>
                    {goals.map((goal) => (
                        <View key={goal.id} style={styles.goalItem}>
                            <Feather name="check-circle" size={20} color={COLORS.primary} />
                            <Text style={styles.goalText}>{goal.text}</Text>
                        </View>
                    ))}
                </View>
            </Card>

            <Card>
                <Text style={styles.label}>Your Name (optional)</Text>
                <TextInput 
                    value={name} 
                    onChangeText={setName}
                    placeholder="Enter your name" 
                    style={styles.input}
                />
                
                <View style={styles.switchRow}>
                    <Text style={styles.label}>Enable Notifications</Text>
                    <Switch value={notifications} onValueChange={setNotifications} />
                </View>
            </Card>

            <View style={styles.actions}>
                <Button label="Finish & Get Today's Plan" onPress={handleFinish} kind="primary" />
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
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        marginBottom: 16,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    actions: {
        marginTop: SPACING.xl,
        gap: SPACING.md,
    },
})
