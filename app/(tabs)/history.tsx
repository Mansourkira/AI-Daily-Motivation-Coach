import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useCoach } from "@/contexts/store"

export default function HistoryScreen() {
    const { plans } = useCoach()
    const planEntries = Object.entries(plans).sort((a, b) => b[0].localeCompare(a[0]))

    if (planEntries.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Feather name="inbox" size={48} color="#8A8F98" />
                <Text style={styles.emptyText}>Your completed plans will appear here.</Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>History</Text>
            <Text style={styles.sub}>Your saved daily plans</Text>

            <View style={styles.plansList}>
                {planEntries.map(([date, plan]) => (
                    <View key={date} style={styles.planCard}>
                        <Text style={styles.planDate}>{date}</Text>
                        <View style={styles.tasksList}>
                            {plan.tasks.map(task => (
                                <View key={task.id} style={styles.taskItem}>
                                    <Feather 
                                        name={task.done ? 'check-circle' : 'circle'} 
                                        size={16} 
                                        color={task.done ? '#1f9d55' : '#8A8F98'} 
                                    />
                                    <Text style={[styles.taskText, task.done && styles.taskDone]}>
                                        {task.text}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <Text style={styles.completionText}>
                            {plan.tasks.filter(t => t.done).length} / {plan.tasks.length} completed
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
    emptyText: { fontSize: 16, color: '#8A8F98', textAlign: 'center' },
    heading: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
    sub: { color: '#8A8F98', marginBottom: 20 },
    plansList: { gap: 16 },
    planCard: { padding: 16, backgroundColor: '#f5f5f5', borderRadius: 12, gap: 12 },
    planDate: { fontSize: 18, fontWeight: '600' },
    tasksList: { gap: 8 },
    taskItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    taskText: { fontSize: 15, flex: 1 },
    taskDone: { textDecorationLine: 'line-through', opacity: 0.6 },
    completionText: { fontSize: 14, color: '#8A8F98', fontStyle: 'italic' },
})

