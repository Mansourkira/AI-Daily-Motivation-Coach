import { databaseService } from "../services/database";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const DBReadyCtx = createContext(false);

export function DBProvider({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        let timeoutId: NodeJS.Timeout | null = null;

        (async () => {
            try {
                console.log("Initializing database...");

                // Add a timeout to prevent infinite loading
                timeoutId = setTimeout(() => {
                    if (isMounted) {
                        console.warn("Database initialization timeout, proceeding anyway");
                        setReady(true);
                        setError("Database initialization timeout");
                    }
                }, 10000); // 10 second timeout

                await databaseService.initDatabase();
                console.log("Database initialized successfully");

                if (isMounted) {
                    clearTimeout(timeoutId!);
                    setReady(true);
                    setError(null);
                }
            } catch (err) {
                console.error("Database initialization failed:", err);

                if (isMounted) {
                    clearTimeout(timeoutId!);
                    setError(err instanceof Error ? err.message : "Database initialization failed");
                    setReady(true); // Still set ready to prevent infinite loading
                }
            }
        })();

        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId!);
        };
    }, []);

    if (!ready) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Initialisation de la base de données...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Erreur: {error}</Text>
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
    },
});
