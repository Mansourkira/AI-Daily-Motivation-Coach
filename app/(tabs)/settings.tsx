"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput } from "react-native"
import { useCoach } from "@/contexts/store"
import { useState } from "react"
import type { Locale, Focus } from "@/contexts/store"

const LANGUAGES: { value: Locale; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'ar', label: 'العربية' },
]

const FOCUS_AREAS: Focus[] = ['health', 'study', 'work', 'finance', 'faith', 'personal', 'relationships']

export default function SettingsScreen() {
    const { settings, setSettings } = useCoach()
    const [name, setName] = useState(settings.name || '')

    const toggleFocus = (focus: Focus) => {
        const current = settings.focusAreas || []
        const updated = current.includes(focus)
            ? current.filter(f => f !== focus)
            : current.length < 3 ? [...current, focus] : current
        setSettings({ focusAreas: updated })
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Settings</Text>
            <Text style={styles.sub}>Customize your experience</Text>

            <View style={styles.section}>
                <Text style={styles.sectionLabel}>Name</Text>
                <TextInput 
                    value={name} 
                    onChangeText={setName}
                    onBlur={() => setSettings({ name })}
                    placeholder="Your name (optional)" 
                    style={styles.input}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionLabel}>Language</Text>
                <View style={styles.chipsContainer}>
                    {LANGUAGES.map(lang => (
                        <TouchableOpacity 
                            key={lang.value}
                            onPress={() => setSettings({ locale: lang.value })}
                            style={[styles.chip, settings.locale === lang.value && styles.chipActive]}
                        >
                            <Text style={[styles.chipText, settings.locale === lang.value && styles.chipTextActive]}>
                                {lang.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionLabel}>Wake Time</Text>
                <TextInput 
                    value={settings.wakeTime} 
                    onChangeText={(v) => setSettings({ wakeTime: v })}
                    placeholder="07:00" 
                    style={styles.input}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionLabel}>Focus Areas (max 3)</Text>
                <View style={styles.chipsContainer}>
                    {FOCUS_AREAS.map(focus => (
                        <TouchableOpacity 
                            key={focus}
                            onPress={() => toggleFocus(focus)}
                            style={[styles.chip, settings.focusAreas?.includes(focus) && styles.chipActive]}
                        >
                            <Text style={[styles.chipText, settings.focusAreas?.includes(focus) && styles.chipTextActive]}>
                                {focus}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.row}>
                    <Text style={styles.sectionLabel}>Notifications</Text>
                    <Switch 
                        value={settings.notifications} 
                        onValueChange={(v) => setSettings({ notifications: v })}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    heading: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
    sub: { color: '#8A8F98', marginBottom: 20 },
    section: { marginBottom: 24 },
    sectionLabel: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, fontSize: 16 },
    chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
    chipActive: { backgroundColor: '#1f9d55', borderColor: '#1f9d55' },
    chipText: { fontSize: 14, color: '#333' },
    chipTextActive: { color: '#fff', fontWeight: '600' },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
})

