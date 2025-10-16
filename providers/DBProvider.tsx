import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { databaseService } from "@/services/database";
import { useCoach } from "@/contexts/store";

const DBReadyCtx = createContext(false);

export function DBProvider({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Use ref to track if initialization has started
    const initStarted = useRef(false);

    useEffect(() => {
        // Only run once
        if (initStarted.current) return;
        initStarted.current = true;

        let isMounted = true;
        let timeoutId: NodeJS.Timeout | undefined;
        // Define the initialization function
        const initDb = async () => {
            try {
                console.log("🚀 Initializing database provider...");

                // Initialize database service (this will also handle authentication)
                await databaseService.initDatabase();
                console.log("✅ Database service initialized successfully");

                // Load data into store
                try {
                    // Get the function directly from the store to avoid subscription
                    await useCoach.getState().loadData();
                    console.log("✅ Data loaded into store");
                } catch (loadErr) {
                    console.error("❌ Error loading data:", loadErr);
                    // Don't throw here, just log the error and continue
                }

                if (isMounted) {
                    if (timeoutId) clearTimeout(timeoutId);
                    setReady(true);
                    setError(null);
                }
            } catch (err) {
                console.error("❌ Database initialization failed:", err);
                if (isMounted) {
                    if (timeoutId) clearTimeout(timeoutId);
                    setError(err instanceof Error ? err.message : "Database initialization failed");
                    setReady(true); // Still set ready to prevent infinite loading
                }
            }
        };

        // Start initialization
        initDb();

        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []); // Empty dependency array

    if (!ready) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: '#F9FAFB' } as any]}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Connecting to cloud database...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer as any}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <Text style={styles.errorHint}>Make sure your internet connection is active</Text>
            </View>
        );
    }

    return <DBReadyCtx.Provider value={true}>{children}</DBReadyCtx.Provider>;
}

export const useDBReady = () => useContext(DBReadyCtx);

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#EF4444',
        textAlign: 'center',
        marginBottom: 8,
    },
    errorHint: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
});
