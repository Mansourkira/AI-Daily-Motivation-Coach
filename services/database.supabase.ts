import { supabaseService } from './supabase.service';
import type { Goal, DailyPlan, Settings, Locale, Focus } from '@/contexts/store';

/**
 * Database service that wraps the Supabase service
 * for compatibility with the existing store
 */
class SupabaseDatabaseService {
    private initialized = false;

    /**
     * Initialize the database service
     * Ensures Supabase client is initialized and user is authenticated
     */
    async initDatabase(): Promise<void> {
        if (this.initialized) return;

        try {
            console.log('Initializing database service...');

            // Initialize Supabase client
            await supabaseService.initDatabase();

            // Ensure authenticated
            await supabaseService.ensureAuth();

            this.initialized = true;
            console.log('✅ Database service initialized');
        } catch (error) {
            console.error('Error initializing database service:', error);
            throw error;
        }
    }

    private ensureInitialized(): void {
        if (!this.initialized) {
            throw new Error('Database not initialized. Please call initDatabase() first.');
        }
    }

    // ---- User & Onboarding ----
    async getOnboardingStatus(): Promise<boolean> {
        this.ensureInitialized();
        return await supabaseService.getOnboardingStatus();
    }

    async setOnboardingDone(done: boolean): Promise<void> {
        this.ensureInitialized();
        // Onboarding status is set when upsertProfileAndSettings is called
        console.log('Onboarding status will be set to:', done);
    }

    // ---- Settings ----
    async getSettings(): Promise<Settings> {
        this.ensureInitialized();

        try {
            const settings = await supabaseService.getSettings();

            if (!settings) {
                // Return defaults if no settings found
                return {
                    locale: 'en',
                    wakeTime: '07:00',
                    focusAreas: [],
                    notifications: false,
                    adsConsent: 'not_set',
                };
            }

            return {
                locale: settings.locale as Locale,
                wakeTime: settings.wake_time,
                focusAreas: settings.focus_areas as Focus[],
                notifications: settings.notifications,
                name: settings.name,
                adsConsent: settings.ads_consent as 'granted' | 'denied' | 'not_set',
            };
        } catch (error) {
            console.error('Error getting settings:', error);
            // Return defaults on error
            return {
                locale: 'en',
                wakeTime: '07:00',
                focusAreas: [],
                notifications: false,
                adsConsent: 'not_set',
            };
        }
    }

    async updateSettings(settings: Partial<Settings>): Promise<void> {
        this.ensureInitialized();

        // Map camelCase to snake_case for Supabase
        const payload: any = {
            locale: settings.locale || 'en',
            wake_time: settings.wakeTime || '07:00',
            focus_areas: settings.focusAreas || [],
            notifications: settings.notifications !== undefined ? settings.notifications : false,
            ads_consent: settings.adsConsent || 'not_set',
            name: settings.name,
        };

        await supabaseService.upsertProfileAndSettings(payload);
    }

    // ---- Goals ----
    async getGoals(): Promise<Goal[]> {
        this.ensureInitialized();

        try {
            const goals = await supabaseService.getGoals();

            return goals
                .filter(g => !g.archived_at)
                .map((g) => ({
                    id: g.id,
                    text: g.text,
                    createdAt: g.created_at,
                    archivedAt: g.archived_at || undefined,
                }));
        } catch (error) {
            console.error('Error getting goals:', error);
            return [];
        }
    }

    async addGoal(text: string): Promise<Goal> {
        this.ensureInitialized();

        const result = await supabaseService.addGoal(text);

        return {
            id: result.id,
            text: text.trim(),
            createdAt: new Date().toISOString(),
        };
    }

    async removeGoal(id: string): Promise<void> {
        this.ensureInitialized();

        try {
            // Archive goal by updating archived_at field
            await supabaseService.archiveGoal(id);
            console.log('✅ Goal archived:', id);
        } catch (error) {
            console.error('Error archiving goal:', error);
            throw error;
        }
    }

    // ---- Plans & Tasks ----
    async getPlans(): Promise<Record<string, DailyPlan>> {
        this.ensureInitialized();

        try {
            // For now, just get today's plan
            const plan = await supabaseService.getTodayPlan();

            if (!plan) {
                return {};
            }

            return {
                [plan.date]: {
                    id: plan.id,
                    date: plan.date,
                    tasks: plan.tasks || [],
                    sourcePromptHash: plan.source_prompt_hash,
                },
            };
        } catch (error) {
            console.error('Error getting plans:', error);
            return {};
        }
    }

    async savePlan(plan: DailyPlan): Promise<void> {
        this.ensureInitialized();

        try {
            await supabaseService.savePlan(plan);
            console.log('✅ Plan saved:', plan.date);
        } catch (error) {
            console.error('Error saving plan:', error);
            throw error;
        }
    }

    async toggleTask(date: string, taskId: string): Promise<void> {
        this.ensureInitialized();

        try {
            await supabaseService.toggleTask(taskId);
            console.log('✅ Task toggled:', taskId);
        } catch (error) {
            console.error('Error toggling task:', error);
            throw error;
        }
    }

    getUserId(): string | null {
        return null;
    }

    async resetAllData(): Promise<void> {
        this.ensureInitialized();
        console.log('Reset all data - not implemented');
    }
}

export const databaseService = new SupabaseDatabaseService();
