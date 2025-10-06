import { View, Text, StyleSheet } from "react-native"
import { Feather } from "@expo/vector-icons"
import { Screen, Title, Card, SPACING, COLORS } from "../components/UI"

export default function HistoryScreen() {
    return (
        <Screen scroll>
            <Title children="History" subtitle="Your saved daily cards" />

            <Card>
                <View style={styles.emptyState}>
                    <Feather name="inbox" size={48} color={COLORS.sub} />
                    <Text style={styles.emptyText}>Saved daily cards will appear here.</Text>
                </View>
            </Card>
        </Screen>
    )
}

const styles = StyleSheet.create({
    emptyState: {
        alignItems: "center",
        paddingVertical: SPACING.xl * 2,
        gap: SPACING.md,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.sub,
        textAlign: "center",
    },
})
