"use client"

import { useEffect } from "react"
import { Stack } from "expo-router"
import { I18nManager } from "react-native"

export default function RootLayout() {
    // For demo purposes, using hardcoded locale
    const locale = "en" // Could be 'ar' for RTL

    useEffect(() => {
        // Enable RTL if Arabic
        if (locale === "ar" && !I18nManager.isRTL) {
            I18nManager.forceRTL(true)
        } else if (locale !== "ar" && I18nManager.isRTL) {
            I18nManager.forceRTL(false)
        }
    }, [locale])

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
            }}
        />
    )
}
