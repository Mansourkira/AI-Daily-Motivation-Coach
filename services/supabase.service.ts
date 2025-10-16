import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Custom storage adapter for Expo
const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        return SecureStore.getItemAsync(key);
    },
    setItem: (key: string, value: string) => {
        return SecureStore.setItemAsync(key, value);
    },
    removeItem: (key: string) => {
        return SecureStore.deleteItemAsync(key);
    },
};

class SupabaseService {
    private client: SupabaseClient | null = null;
    private initialized = false;

    /**
     * Initialize the Supabase client singleton
     * Must be called once at app start
     */
    async initDatabase(): Promise<void> {
        if (this.initialized) {
            return;
        }

        const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error(
                'Missing Supabase credentials. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.'
            );
        }

        this.client = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                storage: ExpoSecureStoreAdapter,
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: false,
            },
        });

        this.initialized = true;
        console.log('✅ Supabase client initialized');
    }

    /**
     * Get the Supabase client instance
     * Throws if not initialized
     */
    private getClient(): SupabaseClient {
        if (!this.client || !this.initialized) {
            throw new Error(
                'Database not initialized. Please call initDatabase() first.'
            );
        }
        return this.client;
    }

    /**
     * Ensure user is authenticated
     * If not signed in, sign in anonymously
     * Returns user ID
     */
    async ensureAuth(): Promise<string> {
        const client = this.getClient();

        // Check if already authenticated
        const {
            data: { session },
        } = await client.auth.getSession();

        if (session?.user) {
            console.log('✅ User already authenticated:', session.user.id);

            // Ensure profile exists
            await this.ensureProfile(session.user.id);

            return session.user.id;
        }

        // Sign in anonymously
        console.log('🔐 Signing in anonymously...');
        const { data, error } = await client.auth.signInAnonymously();

        if (error || !data.user) {
            throw new Error(`Anonymous sign-in failed: ${error?.message || 'Unknown error'}`);
        }

        console.log('✅ Signed in anonymously:', data.user.id);

        // Create profile for new user
        await this.ensureProfile(data.user.id);

        return data.user.id;
    }

    /**
     * Ensure profile exists for the user
     */
    private async ensureProfile(userId: string): Promise<void> {
        const client = this.getClient();

        // Check if profile exists
        const { data: profile } = await client
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .single();

        if (!profile) {
            // Create profile
            const { error } = await client
                .from('profiles')
                .insert({ id: userId, onboarding_done: false });

            if (error && error.code !== '23505') { // Ignore duplicate key errors
                console.error('Failed to create profile:', error);
            } else {
                console.log('✅ Profile created for user:', userId);
            }
        }
    }

    /**
     * Get current user ID (null if not authenticated)
     */
    async getCurrentUserId(): Promise<string | null> {
        const client = this.getClient();
        const {
            data: { session },
        } = await client.auth.getSession();
        return session?.user?.id || null;
    }

    /**
     * Upsert profile and settings using RPC
     */
    async upsertProfileAndSettings(payload: {
        name?: string;
        locale: string;
        wake_time: string;
        focus_areas: string[];
        notifications: boolean;
        ads_consent: string;
    }): Promise<void> {
        const client = this.getClient();
        await this.ensureAuth();

        const { error } = await client.rpc('upsert_profile_settings', {
            p_name: payload.name || null,
            p_locale: payload.locale,
            p_wake_time: payload.wake_time,
            p_focus_areas: payload.focus_areas,
            p_notifications: payload.notifications,
            p_ads_consent: payload.ads_consent,
        });

        if (error) {
            throw new Error(`Failed to upsert profile: ${error.message}`);
        }

        console.log('✅ Profile and settings upserted');
    }

    /**
     * Create empty plan for today
     * Ignores conflict if plan already exists
     */
    async createEmptyPlanForToday(): Promise<void> {
        const client = this.getClient();
        const userId = await this.ensureAuth();
        const today = new Date().toISOString().split('T')[0];

        const { error } = await client
            .from('plans')
            .insert({
                user_id: userId,
                date: today,
            })
            .select()
            .single();

        // Ignore conflict errors (plan already exists)
        if (error && !error.message.includes('duplicate') && error.code !== '23505') {
            throw new Error(`Failed to create plan: ${error.message}`);
        }

        console.log('✅ Plan for today created/verified');
    }

    /**
     * Add a goal
     * Rejects if 3 active goals already exist
     */
    async addGoal(text: string): Promise<{ id: string }> {
        const client = this.getClient();
        const userId = await this.ensureAuth();

        // Count active goals
        const { count, error: countError } = await client
            .from('goals')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .is('archived_at', null);

        if (countError) {
            throw new Error(`Failed to count goals: ${countError.message}`);
        }

        if ((count || 0) >= 3) {
            throw new Error('You already have 3 active goals. Archive one before adding more.');
        }

        // Insert goal
        const { data, error } = await client
            .from('goals')
            .insert({
                user_id: userId,
                text: text.trim().slice(0, 80),
            })
            .select('id')
            .single();

        if (error) {
            throw new Error(`Failed to add goal: ${error.message}`);
        }

        console.log('✅ Goal added:', data.id);
        return { id: data.id };
    }

    /**
     * Get today's plan with tasks
     */
    async getTodayPlan(): Promise<any> {
        const client = this.getClient();
        const userId = await this.ensureAuth();
        const today = new Date().toISOString().split('T')[0];

        const { data: plan, error } = await client
            .from('plans')
            .select(`
        *,
        tasks (
          id,
          text,
          at,
          done,
          order_index
        )
      `)
            .eq('user_id', userId)
            .eq('date', today)
            .single();

        if (error && error.code !== 'PGRST116') {
            // PGRST116 = not found
            throw new Error(`Failed to get plan: ${error.message}`);
        }

        if (!plan) {
            return null;
        }

        // Sort tasks by order_index
        const tasks = (plan.tasks || []).sort((a: any, b: any) => a.order_index - b.order_index);

        return {
            id: plan.id,
            date: plan.date,
            tasks,
            source_prompt_hash: plan.source_prompt_hash,
        };
    }

    /**
     * Get goal suggestions by focus areas
     */
    async getGoalSuggestions(focusAreas: string[]): Promise<Array<{ id: string; text: string; category: string }>> {
        const client = this.getClient();

        if (!focusAreas || focusAreas.length === 0) {
            return [];
        }

        // Get suggestions from catalog based on focus areas
        const { data, error } = await client
            .from('goal_suggestion_catalog')
            .select('id, text_en, focus_area_key')
            .in('focus_area_key', focusAreas);

        if (error) {
            console.error('Failed to get goal suggestions:', error.message);
            return [];
        }

        return (data || []).map((item: any) => ({
            id: item.id,
            text: item.text_en,
            category: item.focus_area_key,
        }));
    }

    /**
     * Get all goals for current user
     */
    async getGoals(): Promise<Array<{ id: string; text: string; created_at: string; archived_at: string | null }>> {
        const client = this.getClient();
        const userId = await this.ensureAuth();

        const { data, error } = await client
            .from('goals')
            .select('id, text, created_at, archived_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) {
            throw new Error(`Failed to get goals: ${error.message}`);
        }

        return data || [];
    }

    /**
     * Get settings for current user
     */
    async getSettings(): Promise<any> {
        const client = this.getClient();
        const userId = await this.ensureAuth();

        // First, get profile to check onboarding status
        const { data: profile } = await client
            .from('profiles')
            .select('onboarding_done, name')
            .eq('id', userId)
            .single();

        if (!profile || !profile.onboarding_done) {
            return null;
        }

        // Get settings
        const { data, error } = await client
            .from('settings')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to get settings: ${error.message}`);
        }

        if (!data) {
            return null;
        }

        return {
            locale: data.locale,
            wake_time: data.wake_time,
            focus_areas: data.focus_areas,
            notifications: data.notifications,
            ads_consent: data.ads_consent,
            name: profile.name,
        };
    }

    /**
     * Get onboarding status
     */
    async getOnboardingStatus(): Promise<boolean> {
        const client = this.getClient();
        const userId = await this.ensureAuth();

        const { data, error } = await client
            .from('profiles')
            .select('onboarding_done')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Failed to get onboarding status:', error);
            return false;
        }

        return data?.onboarding_done || false;
    }
}

// Export singleton instance
export const supabaseService = new SupabaseService();
