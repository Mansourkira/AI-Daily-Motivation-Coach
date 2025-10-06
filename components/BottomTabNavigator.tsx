import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

interface TabItem {
    name: string;
    href: string;
    icon: string;
    label: string;
}

const tabs: TabItem[] = [
    { name: 'index', href: '/', icon: '🏠', label: 'Home' },
    { name: 'goals', href: '/goals', icon: '🎯', label: 'Goals' },
    { name: 'history', href: '/history', icon: '📊', label: 'History' },
    { name: 'settings', href: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function BottomTabNavigator() {
    const { colors } = useTheme();
    const pathname = usePathname();

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingBottom: 8,
            paddingTop: 8,
            paddingHorizontal: 16,
        },
        tab: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: 8,
        },
        activeTab: {
            backgroundColor: colors.primary + '20',
            borderRadius: 8,
        },
        icon: {
            fontSize: 20,
            marginBottom: 4,
        },
        label: {
            fontSize: 12,
            fontFamily: 'System',
            textAlign: 'center',
        },
        activeLabel: {
            color: colors.primary,
            fontWeight: '600',
        },
        inactiveLabel: {
            color: colors.textSecondary,
        },
    });

    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const isActive = pathname === tab.href;

                return (
                    <Link key={tab.name} href={tab.href} asChild>
                        <TouchableOpacity style={[styles.tab, isActive && styles.activeTab]}>
                            <Text style={styles.icon}>{tab.icon}</Text>
                            <Text style={[
                                styles.label,
                                isActive ? styles.activeLabel : styles.inactiveLabel
                            ]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    </Link>
                );
            })}
        </View>
    );
}
