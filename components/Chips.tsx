import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { COLORS, SPACING, RADIUS, MIN_TAP } from "./UI"

interface ChipProps {
    label: string
    selected: boolean
    onPress: () => void
}

export function Chip({ label, selected, onPress }: ChipProps) {
    return (
        <TouchableOpacity style={[styles.chip, selected && styles.chipSelected]} onPress={onPress} activeOpacity={0.7}>
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
        </TouchableOpacity>
    )
}

interface ChipGroupProps {
    options: string[]
    selected: string[]
    onToggle: (label: string) => void
}

export function ChipGroup({ options, selected, onToggle }: ChipGroupProps) {
    return (
        <View style={styles.chipGroup}>
            {options.map((option) => (
                <Chip key={option} label={option} selected={selected.includes(option)} onPress={() => onToggle(option)} />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    chip: {
        minHeight: MIN_TAP,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS * 2,
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: "center",
        alignItems: "center",
    },
    chipSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    chipText: {
        fontSize: 15,
        fontWeight: "500",
        color: COLORS.text,
    },
    chipTextSelected: {
        color: COLORS.bg,
        fontWeight: "600",
    },
    chipGroup: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: SPACING.sm,
    },
})
