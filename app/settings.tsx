import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsScreen() {
    const { theme, colors, isDark, setTheme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: 20,
            paddingTop: 20,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 20,
            fontFamily: 'System',
        },
        section: {
            marginBottom: 32,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 16,
            fontFamily: 'System',
        },
        settingItem: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        settingInfo: {
            flex: 1,
        },
        settingTitle: {
            fontSize: 16,
            fontWeight: '500',
            color: colors.text,
            marginBottom: 4,
            fontFamily: 'System',
        },
        settingDescription: {
            fontSize: 14,
            color: colors.textSecondary,
            fontFamily: 'System',
        },
        themeOption: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 8,
            borderWidth: 2,
            borderColor: colors.border,
        },
        themeOptionActive: {
            borderColor: colors.primary,
        },
        themeOptionText: {
            fontSize: 16,
            color: colors.text,
            fontFamily: 'System',
        },
        themeOptionTextActive: {
            color: colors.primary,
            fontWeight: '600',
        },
        button: {
            backgroundColor: colors.primary,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
            marginTop: 20,
        },
        buttonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600',
            fontFamily: 'System',
        },
        dangerButton: {
            backgroundColor: colors.error,
        },
        versionText: {
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: 20,
            fontFamily: 'System',
        },
    });

    const themeOptions = [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'system', label: 'System' },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Settings</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Appearance</Text>

                {themeOptions.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.themeOption,
                            theme === option.value && styles.themeOptionActive
                        ]}
                        onPress={() => setTheme(option.value as any)}
                    >
                        <Text style={[
                            styles.themeOptionText,
                            theme === option.value && styles.themeOptionTextActive
                        ]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Daily Reminders</Text>
                        <Text style={styles.settingDescription}>
                            Get daily motivation reminders
                        </Text>
                    </View>
                    <Switch
                        value={true}
                        onValueChange={() => { }}
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={isDark ? '#ffffff' : '#ffffff'}
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Goal Reminders</Text>
                        <Text style={styles.settingDescription}>
                            Remind me about my goals
                        </Text>
                    </View>
                    <Switch
                        value={false}
                        onValueChange={() => { }}
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={isDark ? '#ffffff' : '#ffffff'}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data & Privacy</Text>

                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Export Data</Text>
                        <Text style={styles.settingDescription}>
                            Download your personal data
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Privacy Policy</Text>
                        <Text style={styles.settingDescription}>
                            Read our privacy policy
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>

                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Help & FAQ</Text>
                        <Text style={styles.settingDescription}>
                            Get help and find answers
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Contact Support</Text>
                        <Text style={styles.settingDescription}>
                            Send us feedback or report issues
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.button, styles.dangerButton]}>
                <Text style={styles.buttonText}>Reset All Data</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Version 1.0.0</Text>
        </ScrollView>
    );
}
