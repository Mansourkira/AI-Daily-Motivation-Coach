import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function HomeScreen() {
    const { colors, isDark } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: 20,
            paddingTop: 20,
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 8,
            fontFamily: 'System',
        },
        subtitle: {
            fontSize: 16,
            color: colors.textSecondary,
            marginBottom: 32,
            fontFamily: 'System',
        },
        card: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 8,
            fontFamily: 'System',
        },
        cardDescription: {
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 20,
            fontFamily: 'System',
        },
        button: {
            backgroundColor: colors.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            marginTop: 16,
            alignSelf: 'flex-start',
        },
        buttonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600',
            fontFamily: 'System',
        },
        navigationGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginTop: 32,
        },
        navButton: {
            width: '48%',
            backgroundColor: colors.surface,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
        },
        navButtonText: {
            color: colors.text,
            fontSize: 16,
            fontWeight: '500',
            fontFamily: 'System',
        },
    });

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Welcome to AI Daily Coach</Text>
            <Text style={styles.subtitle}>Your personal motivation companion</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Today's Motivation</Text>
                <Text style={styles.cardDescription}>
                    Start your day with personalized motivation and guidance. Set goals, track progress, and stay motivated throughout your journey.
                </Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.navigationGrid}>
                <Link href="/goals" asChild>
                    <TouchableOpacity style={styles.navButton}>
                        <Text style={styles.navButtonText}>🎯 Goals</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/history" asChild>
                    <TouchableOpacity style={styles.navButton}>
                        <Text style={styles.navButtonText}>📊 History</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/settings" asChild>
                    <TouchableOpacity style={styles.navButton}>
                        <Text style={styles.navButtonText}>⚙️ Settings</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </ScrollView>
    );
}
