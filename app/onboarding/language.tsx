"use client"
import { View, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { Screen, Title, Button, SPACING } from "../../components/UI"
import { useCoach } from "@/contexts/store"
import type { Locale } from "@/contexts/store"

export default function LanguageScreen() {
    const router = useRouter()
    const { setSettings } = useCoach()

    const selectLanguage = (lang: Locale) => {
        setSettings({ locale: lang })
        router.push("/onboarding/categories")
    }

    return (
        <Screen>
            <View style={styles.buttonContainer}>
                <Title children="Choose language" />

                <Button label="English" onPress={() => selectLanguage("en")} kind="primary" />
                <Button label="Français" onPress={() => selectLanguage("fr")} kind="primary" />
                <Button label="العربية" onPress={() => selectLanguage("ar")} kind="primary" />
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        gap: SPACING.md,
        justifyContent: "center",

    },
})
