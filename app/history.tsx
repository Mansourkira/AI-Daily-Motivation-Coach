import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface HistoryEntry {
    id: string;
    date: string;
    activity: string;
    duration: string;
    mood: 'great' | 'good' | 'okay' | 'poor';
}

export default function HistoryScreen() {
    const { colors } = useTheme();

    const historyData: HistoryEntry[] = [
        {
            id: '1',
            date: '2024-01-15',
            activity: 'Morning Meditation',
            duration: '15 minutes',
            mood: 'great',
        },
        {
            id: '2',
            date: '2024-01-14',
            activity: 'Goal Setting Session',
            duration: '30 minutes',
            mood: 'good',
        },
        {
            id: '3',
            date: '2024-01-13',
            activity: 'Progress Review',
            duration: '20 minutes',
            mood: 'okay',
        },
        {
            id: '4',
            date: '2024-01-12',
            activity: 'Motivation Reading',
            duration: '25 minutes',
            mood: 'great',
        },
    ];

    const getMoodColor = (mood: string) => {
        switch (mood) {
            case 'great': return colors.success;
            case 'good': return colors.primary;
            case 'okay': return colors.warning;
            case 'poor': return colors.error;
            default: return colors.textSecondary;
        }
    };

    const getMoodEmoji = (mood: string) => {
        switch (mood) {
            case 'great': return '😊';
            case 'good': return '🙂';
            case 'okay': return '😐';
            case 'poor': return '😔';
            default: return '😐';
        }
    };

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
        statsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 24,
        },
        statCard: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            flex: 1,
            marginHorizontal: 4,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
        },
        statNumber: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.primary,
            fontFamily: 'System',
        },
        statLabel: {
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 4,
            fontFamily: 'System',
        },
        filterContainer: {
            flexDirection: 'row',
            marginBottom: 20,
        },
        filterButton: {
            backgroundColor: colors.surface,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            marginRight: 8,
            borderWidth: 1,
            borderColor: colors.border,
        },
        filterButtonActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        filterButtonText: {
            fontSize: 14,
            color: colors.text,
            fontFamily: 'System',
        },
        filterButtonTextActive: {
            color: '#ffffff',
        },
        historyItem: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
        },
        historyHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        historyDate: {
            fontSize: 14,
            color: colors.textSecondary,
            fontFamily: 'System',
        },
        moodIndicator: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        moodText: {
            fontSize: 14,
            marginLeft: 4,
            fontFamily: 'System',
        },
        activityTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 4,
            fontFamily: 'System',
        },
        durationText: {
            fontSize: 14,
            color: colors.textSecondary,
            fontFamily: 'System',
        },
    });

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Activity History</Text>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Days Active</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>4.2</Text>
                    <Text style={styles.statLabel}>Avg Mood</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>18h</Text>
                    <Text style={styles.statLabel}>Total Time</Text>
                </View>
            </View>

            <View style={styles.filterContainer}>
                <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
                    <Text style={[styles.filterButtonText, styles.filterButtonTextActive]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterButtonText}>This Week</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterButtonText}>This Month</Text>
                </TouchableOpacity>
            </View>

            {historyData.map((entry) => (
                <View key={entry.id} style={styles.historyItem}>
                    <View style={styles.historyHeader}>
                        <Text style={styles.historyDate}>{entry.date}</Text>
                        <View style={styles.moodIndicator}>
                            <Text>{getMoodEmoji(entry.mood)}</Text>
                            <Text style={[styles.moodText, { color: getMoodColor(entry.mood) }]}>
                                {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.activityTitle}>{entry.activity}</Text>
                    <Text style={styles.durationText}>Duration: {entry.duration}</Text>
                </View>
            ))}

            {historyData.length === 0 && (
                <View style={styles.historyItem}>
                    <Text style={styles.activityTitle}>No history yet</Text>
                    <Text style={styles.durationText}>
                        Start using the app to see your activity history here.
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}
