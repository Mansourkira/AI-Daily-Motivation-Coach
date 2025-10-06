"use client"

import { useState } from "react"
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from "react-native"
import { COLORS, SPACING, RADIUS, Button, SectionLabel } from "./UI"
import { ChipGroup } from "./Chips"

interface BottomSheetAdjustProps {
    visible: boolean
    onClose: () => void
    onSave: (minutes: number, focus: string) => void
    defaultMinutes?: number
    defaultFocus?: string
}

const TIME_OPTIONS = [5, 10, 20]
const FOCUS_OPTIONS = ["reading", "cardio", "deep work"]

export function BottomSheetAdjust({
    visible,
    onClose,
    onSave,
    defaultMinutes = 10,
    defaultFocus = "reading",
}: BottomSheetAdjustProps) {
    const [minutes, setMinutes] = useState(defaultMinutes)
    const [focus, setFocus] = useState(defaultFocus)

    const handleSave = () => {
        onSave(minutes, focus)
        onClose()
    }

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.backdrop}>
                    <TouchableWithoutFeedback>
                        <View style={styles.sheet}>
                            {/* Drag handle */}
                            <View style={styles.handle} />

                            <Text style={styles.title}>Daily Tweak</Text>

                            {/* Time today */}
                            <View style={styles.section}>
                                <SectionLabel>Time today (minutes)</SectionLabel>
                                <View style={styles.segmentedControl}>
                                    {TIME_OPTIONS.map((time) => (
                                        <TouchableOpacity
                                            key={time}
                                            style={[styles.segment, minutes === time && styles.segmentSelected]}
                                            onPress={() => setMinutes(time)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[styles.segmentText, minutes === time && styles.segmentTextSelected]}>{time}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Focus */}
                            <View style={styles.section}>
                                <SectionLabel>Focus</SectionLabel>
                                <ChipGroup options={FOCUS_OPTIONS} selected={[focus]} onToggle={setFocus} />
                            </View>

                            {/* Actions */}
                            <View style={styles.actions}>
                                <View style={{ flex: 1 }}>
                                    <Button label="Cancel" onPress={onClose} kind="ghost" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Button label="Save" onPress={handleSave} kind="primary" />
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: COLORS.card,
        borderTopLeftRadius: RADIUS * 2,
        borderTopRightRadius: RADIUS * 2,
        padding: SPACING.xl,
        paddingBottom: SPACING.xl + 20,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.border,
        borderRadius: 2,
        alignSelf: "center",
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: SPACING.xl,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    segmentedControl: {
        flexDirection: "row",
        backgroundColor: COLORS.bg,
        borderRadius: RADIUS,
        padding: 4,
        gap: 4,
    },
    segment: {
        flex: 1,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS - 2,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 44,
    },
    segmentSelected: {
        backgroundColor: COLORS.primary,
    },
    segmentText: {
        fontSize: 16,
        fontWeight: "500",
        color: COLORS.sub,
    },
    segmentTextSelected: {
        color: COLORS.bg,
        fontWeight: "600",
    },
    actions: {
        flexDirection: "row",
        gap: SPACING.md,
        marginTop: SPACING.md,
    },
})
