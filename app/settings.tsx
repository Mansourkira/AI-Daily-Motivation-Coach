"use client"

import { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Screen, Title, SectionLabel, Button, SPACING } from "../components/UI"
import { ChipGroup } from "../components/Chips"
import { BottomSheetAdjust } from "../components/BottomTabNavigator"

const LANGUAGES = ["EN", "FR", "AR"]
const MODES = ["starter", "balanced", "sprint"]

export default function SettingsScreen() {
    const [language, setLanguage] = useState("EN")
    const [mode, setMode] = useState("balanced")
    const [sheetVisible, setSheetVisible] = useState(false)

    const handleLanguageToggle = (lang: string) => {
        setLanguage(lang)
    }

    const handleModeToggle = (newMode: string) => {
        setMode(newMode)
    }

    const handleDailyTweak = (minutes: number, focus: string) => {
        console.log("Daily tweak saved:", { minutes, focus })
    }

    return (
        <Screen scroll>
            <Title children="Settings" subtitle="Customize your experience" />

            <View style={styles.section}>
                <SectionLabel>Language</SectionLabel>
                <ChipGroup options={LANGUAGES} selected={[language]} onToggle={handleLanguageToggle} />
            </View>

            <View style={styles.section}>
                <SectionLabel>Mode</SectionLabel>
                <ChipGroup options={MODES} selected={[mode]} onToggle={handleModeToggle} />
            </View>

            <View style={styles.section}>
                <Button label="Open Daily Tweak" onPress={() => setSheetVisible(true)} kind="secondary" />
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
    section: {
        marginBottom: SPACING.xl,
    },
})
