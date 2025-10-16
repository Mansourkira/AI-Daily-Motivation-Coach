import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { supabaseService } from '@/services/supabase.service';
import { useCoach } from '@/contexts/store';

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadData = useCoach((state) => state.loadData);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('🚀 Initializing app...');

      // 1. Initialize Supabase database
      await supabaseService.initDatabase();
      console.log('✅ Database initialized');

      // 2. Ensure authentication (sign in anonymously if needed)
      await supabaseService.ensureAuth();
      console.log('✅ Authentication verified');

      // 3. Load data into store
      await loadData();
      console.log('✅ Data loaded into store');

      setInitializing(false);
    } catch (err: any) {
      console.error('❌ App initialization failed:', err);
      setError(err.message || 'Failed to initialize app');
      setInitializing(false);
    }
  };

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Initialization Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorHint}>
          Please check your internet connection and environment variables.
        </Text>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorHint: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
