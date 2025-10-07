"use client"

import { useState } from "react"
import { View, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { Screen, Title, Button, SPACING } from "../../components/UI"
import { ChipGroup } from "../../components/Chips"
import { useCoach } from "@/contexts/store"
import type { Focus } from "@/contexts/store"

const CATEGORIES: Focus[] = ["health", "study", "work", "finance", "faith", "personal", "relationships"]

export default function CategoriesScreen() {
    const router = useRouter()
    const { setSettings } = useCoach()
    const [selected, setSelected] = useState<Focus[]>([])

    const handleToggle = (category: Focus) => {
        if (selected.includes(category)) {
            setSelected(selected.filter((c) => c !== category))
        } else if (selected.length < 3) {
            setSelected([...selected, category])
        }
    }

    const handleContinue = () => {
        setSettings({ focusAreas: selected })
        const categoriesParam = selected.join(",")
        router.push(`/onboarding/quick?cats=${categoriesParam}`)
    }

    return (
        <Screen scroll>
            <Title children="Pick up to 3 focus areas" subtitle="Choose the areas you want to focus on" />
            <View style={styles.chipContainer}>
                <ChipGroup options={CATEGORIES} selected={selected} onToggle={handleToggle} />
            </View>
            <Button label="Continue" onPress={handleContinue} kind="primary" disabled={selected.length === 0} />
        </Screen>
    )
}

const styles = StyleSheet.create({
    chipContainer: {
        marginBottom: SPACING.xl,
    },
})
