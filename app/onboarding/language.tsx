"use client"
import { View, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { Screen, Title, Button, SPACING } from "../../components/UI"

export default function LanguageScreen() {
    const router = useRouter()

    const selectLanguage = (lang: string) => {
        console.log("Selected language:", lang)
        router.push("/onboarding/categories")
    }

    return (
        <Screen>
            <Title children="Choose language" />
            <View style={styles.buttonContainer}>
                <Button label="English" onPress={() => selectLanguage("en")} kind="primary" />
                <Button label="Français" onPress={() => selectLanguage("fr")} kind="primary" />
                <Button label="العربية" onPress={() => selectLanguage("ar")} kind="primary" />
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        gap: SPACING.md,
    },
})
