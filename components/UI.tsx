import type { ReactNode } from "react"
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, type KeyboardTypeOptions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// Theme constants
export const COLORS = {
    bg: "#0B0B0E",
    card: "#111218",
    border: "#23242C",
    text: "#EDEDED",
    sub: "#A7A7B0",
    primary: "#22C55E",
    secondary: "#2DD4BF",
    danger: "#EF4444",
}

export const SPACING = {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
}

export const RADIUS = 12
export const MIN_TAP = 44

// Screen wrapper
interface ScreenProps {
    children: ReactNode
    scroll?: boolean
}

export function Screen({ children, scroll = false }: ScreenProps) {
    const content = <View style={styles.screen}>{children}</View>

    if (scroll) {
        return (
            <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
            {content}
        </SafeAreaView>
    )
}

// Title with optional subtitle
interface TitleProps {
    children: string
    subtitle?: string
}

export function Title({ children, subtitle }: TitleProps) {
    return (
        <View style={styles.titleContainer}>
            <Text style={styles.title}>{children}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    )
}

// Button
interface ButtonProps {
    label: string
    onPress: () => void
    kind?: "primary" | "secondary" | "ghost" | "danger"
    icon?: ReactNode
    disabled?: boolean
}

export function Button({ label, onPress, kind = "primary", icon, disabled = false }: ButtonProps) {
    const buttonStyle = [
        styles.button,
        kind === "primary" && styles.buttonPrimary,
        kind === "secondary" && styles.buttonSecondary,
        kind === "ghost" && styles.buttonGhost,
        kind === "danger" && styles.buttonDanger,
        disabled && styles.buttonDisabled,
    ]

    const textStyle = [
        styles.buttonText,
        kind === "ghost" && styles.buttonTextGhost,
        disabled && styles.buttonTextDisabled,
    ]

    return (
        <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled} activeOpacity={0.7}>
            {icon && <View style={styles.buttonIcon}>{icon}</View>}
            <Text style={textStyle}>{label}</Text>
        </TouchableOpacity>
    )
}

// Row layout
interface RowProps {
    children: ReactNode
    gap?: number
}

export function Row({ children, gap = SPACING.md }: RowProps) {
    return <View style={[styles.row, { gap }]}>{children}</View>
}

// Card
interface CardProps {
    children: ReactNode
    padded?: boolean
}

export function Card({ children, padded = true }: CardProps) {
    return <View style={[styles.card, padded && styles.cardPadded]}>{children}</View>
}

// Input
interface InputProps {
    value: string
    onChangeText: (text: string) => void
    placeholder?: string
    maxLength?: number
    multiline?: boolean
    keyboardType?: KeyboardTypeOptions
}

export function Input({
    value,
    onChangeText,
    placeholder,
    maxLength,
    multiline = false,
    keyboardType = "default",
}: InputProps) {
    return (
        <TextInput
            style={[styles.input, multiline && styles.inputMultiline]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={COLORS.sub}
            maxLength={maxLength}
            multiline={multiline}
            keyboardType={keyboardType}
        />
    )
}

// Section label
interface SectionLabelProps {
    children: string
}

export function SectionLabel({ children }: SectionLabelProps) {
    return <Text style={styles.sectionLabel}>{children}</Text>
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    screen: {
        flex: 1,
        backgroundColor: COLORS.bg,
        padding: SPACING.xl,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.xl,
    },
    titleContainer: {
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.sub,
        lineHeight: 24,
    },
    button: {
        minHeight: MIN_TAP,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonPrimary: {
        backgroundColor: COLORS.primary,
    },
    buttonSecondary: {
        backgroundColor: COLORS.secondary,
    },
    buttonGhost: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    buttonDanger: {
        backgroundColor: COLORS.danger,
    },
    buttonDisabled: {
        opacity: 0.4,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.bg,
    },
    buttonTextGhost: {
        color: COLORS.text,
    },
    buttonTextDisabled: {
        color: COLORS.sub,
    },
    buttonIcon: {
        marginRight: SPACING.xs,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardPadded: {
        padding: SPACING.lg,
    },
    input: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS,
        padding: SPACING.md,
        fontSize: 16,
        color: COLORS.text,
        minHeight: MIN_TAP,
    },
    inputMultiline: {
        minHeight: 80,
        textAlignVertical: "top",
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.sub,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: SPACING.sm,
    },
})
