import { supabase } from '@/lib/supabase';
import type { Goal, DailyPlan, DailyTask, Settings, Locale, Focus } from '@/contexts/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// User ID management - for MVP we use a device ID
const USER_ID_KEY = '@ai_coach_user_id';

class SupabaseDatabaseService {
    private userId: string | null = null;
    private initialized = false;

    /**
     * Initialize the database service
     * Creates or retrieves the user ID and ensures user exists in Supabase
     */
    async initDatabase(): Promise<void> {
        if (this.initialized) return;

        try {
            console.log('Initializing Supabase database...');

            // Get or create user ID
            let storedUserId = await AsyncStorage.getItem(USER_ID_KEY);

            if (!storedUserId) {
                // Create a new user in Supabase
                const { data, error } = await supabase
                    .from('users')
                    .insert({})
                    .select()
                    .single();

                if (error) throw error;

                storedUserId = data.id;
                await AsyncStorage.setItem(USER_ID_KEY, storedUserId);
                console.log('Created new user:', storedUserId);
            } else {
                // Verify user exists
                const { data } = await supabase
                    .from('users')
                    .select('id')
                    .eq('id', storedUserId)
                    .single();

                if (!data) {
                    // User doesn't exist, create new one
                    const { data: newUser, error } = await supabase
                        .from('users')
                        .insert({ id: storedUserId })
                        .select()
                        .single();

                    if (error) throw error;
                    console.log('Recreated user:', storedUserId);
                }
            }

            this.userId = storedUserId;

            // Ensure settings exist
            await this.ensureSettings();

            this.initialized = true;
            console.log('Supabase database initialized successfully');
        } catch (error) {
            console.error('Error initializing Supabase database:', error);
            throw error;
        }
    }

    private ensureInitialized(): void {
        if (!this.initialized || !this.userId) {
            throw new Error('Database not initialized. Please call initDatabase() first.');
        }
    }

    private async ensureSettings(): Promise<void> {
        if (!this.userId) return;

        const { data } = await supabase
            .from('settings')
            .select('id')
            .eq('user_id', this.userId)
            .single();

        if (!data) {
            await supabase.from('settings').insert({
                user_id: this.userId,
                locale: 'en',
                wake_time: '07:00',
                focus_areas: [],
                notifications: false,
                ads_consent: 'not_set',
            });
        }
    }

    // ---- User & Onboarding ----
    async getOnboardingStatus(): Promise<boolean> {
        this.ensureInitialized();

        const { data, error } = await supabase
            .from('users')
            .select('onboarding_done')
            .eq('id', this.userId!)
            .single();

        if (error) {
            console.error('Error getting onboarding status:', error);
            return false;
        }

        return data?.onboarding_done ?? false;
    }

    async setOnboardingDone(done: boolean): Promise<void> {
        this.ensureInitialized();

        const { error } = await supabase
            .from('users')
            .update({ onboarding_done: done })
            .eq('id', this.userId!);

        if (error) {
            console.error('Error setting onboarding status:', error);
            throw error;
        }
    }

    // ---- Settings ----
    async getSettings(): Promise<Settings> {
        this.ensureInitialized();

        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('user_id', this.userId!)
            .single();

        if (error) {
            console.error('Error getting settings:', error);
            // Return defaults
            return {
                locale: 'en',
                wakeTime: '07:00',
                focusAreas: [],
                notifications: false,
                adsConsent: 'not_set',
            };
        }

        return {
            locale: data.locale as Locale,
            wakeTime: data.wake_time,
            focusAreas: data.focus_areas as Focus[],
            notifications: data.notifications,
            adsConsent: data.ads_consent as 'granted' | 'denied' | 'not_set',
        };
    }

    async updateSettings(settings: Partial<Settings>): Promise<void> {
        this.ensureInitialized();

        const updateData: any = {};
        if (settings.locale !== undefined) updateData.locale = settings.locale;
        if (settings.wakeTime !== undefined) updateData.wake_time = settings.wakeTime;
        if (settings.focusAreas !== undefined) updateData.focus_areas = settings.focusAreas;
        if (settings.notifications !== undefined) updateData.notifications = settings.notifications;
        if (settings.adsConsent !== undefined) updateData.ads_consent = settings.adsConsent;

        const { error } = await supabase
            .from('settings')
            .update(updateData)
            .eq('user_id', this.userId!);

        if (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    }

    // ---- Goals ----
    async getGoals(): Promise<Goal[]> {
        this.ensureInitialized();

        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', this.userId!)
            .is('archived_at', null)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error getting goals:', error);
            return [];
        }

        return (data || []).map((g) => ({
            id: g.id,
            text: g.text,
            createdAt: g.created_at,
            archivedAt: g.archived_at || undefined,
        }));
    }

    async addGoal(text: string): Promise<Goal> {
        this.ensureInitialized();

        const { data, error } = await supabase
            .from('goals')
            .insert({
                user_id: this.userId!,
                text: text.trim().slice(0, 80),
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding goal:', error);
            throw error;
        }

        return {
            id: data.id,
            text: data.text,
            createdAt: data.created_at,
        };
    }

    async removeGoal(id: string): Promise<void> {
        this.ensureInitialized();

        const { error } = await supabase
            .from('goals')
            .update({ archived_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', this.userId!);

        if (error) {
            console.error('Error removing goal:', error);
            throw error;
        }
    }

    // ---- Plans & Tasks ----
    async getPlans(): Promise<Record<string, DailyPlan>> {
        this.ensureInitialized();

        const { data: plans, error: plansError } = await supabase
            .from('plans')
            .select(`
        *,
        tasks:tasks(*)
      `)
            .eq('user_id', this.userId!)
            .order('date', { ascending: false });

        if (plansError) {
            console.error('Error getting plans:', plansError);
            return {};
        }

        const result: Record<string, DailyPlan> = {};

        for (const plan of plans || []) {
            const tasks: DailyTask[] = (plan.tasks || [])
                .sort((a: any, b: any) => a.order_index - b.order_index)
                .map((t: any) => ({
                    id: t.id,
                    text: t.text,
                    at: t.at || undefined,
                    done: t.done,
                }));

            result[plan.date] = {
                id: plan.id,
                date: plan.date,
                tasks,
                sourcePromptHash: plan.source_prompt_hash || undefined,
            };
        }

        return result;
    }

    async savePlan(plan: DailyPlan): Promise<void> {
        this.ensureInitialized();

        // Upsert plan
        const { data: planData, error: planError } = await supabase
            .from('plans')
            .upsert({
                id: plan.id,
                user_id: this.userId!,
                date: plan.date,
                source_prompt_hash: plan.sourcePromptHash || null,
            })
            .select()
            .single();

        if (planError) {
            console.error('Error saving plan:', planError);
            throw planError;
        }

        // Delete existing tasks for this plan
        await supabase
            .from('tasks')
            .delete()
            .eq('plan_id', planData.id);

        // Insert new tasks
        const tasksToInsert = plan.tasks.map((task, index) => ({
            id: task.id,
            plan_id: planData.id,
            text: task.text,
            at: task.at || null,
            done: task.done,
            order_index: index,
        }));

        if (tasksToInsert.length > 0) {
            const { error: tasksError } = await supabase
                .from('tasks')
                .insert(tasksToInsert);

            if (tasksError) {
                console.error('Error saving tasks:', tasksError);
                throw tasksError;
            }
        }
    }

    async toggleTask(date: string, taskId: string): Promise<void> {
        this.ensureInitialized();

        // Get the plan for this date
        const { data: plan } = await supabase
            .from('plans')
            .select('id')
            .eq('user_id', this.userId!)
            .eq('date', date)
            .single();

        if (!plan) return;

        // Get current task state
        const { data: task } = await supabase
            .from('tasks')
            .select('done')
            .eq('id', taskId)
            .eq('plan_id', plan.id)
            .single();

        if (!task) return;

        // Toggle the done state
        const { error } = await supabase
            .from('tasks')
            .update({ done: !task.done })
            .eq('id', taskId);

        if (error) {
            console.error('Error toggling task:', error);
            throw error;
        }
    }

    // ---- Utility ----
    getUserId(): string | null {
        return this.userId;
    }

    async resetAllData(): Promise<void> {
        this.ensureInitialized();

        // Delete in order due to foreign key constraints
        await supabase.from('tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('plans').delete().eq('user_id', this.userId!);
        await supabase.from('goals').delete().eq('user_id', this.userId!);
        await supabase.from('settings').delete().eq('user_id', this.userId!);
        await supabase.from('users').delete().eq('id', this.userId!);

        // Clear local storage
        await AsyncStorage.removeItem(USER_ID_KEY);
        this.userId = null;
        this.initialized = false;
    }
}

export const databaseService = new SupabaseDatabaseService();

