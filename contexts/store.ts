import { create } from 'zustand';
import { databaseService } from '@/services/database';
import { nanoid } from 'nanoid/non-secure';

export type Locale = 'en' | 'fr' | 'ar';
export type Focus = 'health' | 'study' | 'work' | 'finance' | 'faith' | 'personal' | 'relationships' | string;

export type Goal = { id: string; text: string; createdAt: string; archivedAt?: string; };
export type DailyTask = { id: string; text: string; at?: string; done: boolean; };
export type DailyPlan = { id: string; date: string; tasks: DailyTask[]; sourcePromptHash?: string; };

export type Settings = {
  locale: Locale;
  wakeTime: string;      // "07:00"
  focusAreas: Focus[];   // up to 3
  notifications: boolean;
  name?: string;
  adsConsent?: 'granted' | 'denied' | 'not_set';
};

type CoachState = {
  onboardingDone?: boolean;
  goals: Goal[];
  settings: Settings;
  plans: Record<string, DailyPlan>; // date -> plan
  lastGeneratedAt?: string;
  isLoading: boolean;

  // actions
  loadData: () => Promise<void>;
  setOnboardingDone: (v: boolean) => Promise<void>;
  setSettings: (patch: Partial<Settings>) => Promise<void>;
  addGoal: (text: string) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  savePlan: (plan: DailyPlan) => Promise<void>;
  toggleTask: (date: string, taskId: string) => Promise<void>;
  hasGoals: () => boolean;
};

const defaultSettings: Settings = {
  locale: 'en',
  wakeTime: '07:00',
  focusAreas: [],
  notifications: false,
  adsConsent: 'not_set',
};

export const useCoach = create<CoachState>((set, get) => ({
  onboardingDone: false,
  goals: [],
  settings: defaultSettings,
  plans: {},
  isLoading: false,

  loadData: async () => {
    try {
      set({ isLoading: true });

      const [onboardingDone, goals, settings, plans] = await Promise.all([
        databaseService.getOnboardingStatus(),
        databaseService.getGoals(),
        databaseService.getSettings(),
        databaseService.getPlans(),
      ]);

      set({
        onboardingDone,
        goals,
        settings,
        plans,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      set({ isLoading: false });
    }
  },

  setOnboardingDone: async (v) => {
    await databaseService.setOnboardingDone(v);
    set({ onboardingDone: v });
  },

  setSettings: async (patch) => {
    const newSettings = { ...get().settings, ...patch };
    await databaseService.updateSettings(patch);
    set({ settings: newSettings });
  },

  addGoal: async (text) => {
    const goal = await databaseService.addGoal(text);
    set((s) => ({ goals: [...s.goals, goal] }));
  },

  removeGoal: async (id) => {
    await databaseService.removeGoal(id);
    set((s) => ({ goals: s.goals.filter(g => g.id !== id) }));
  },

  savePlan: async (plan) => {
    await databaseService.savePlan(plan);
    set((s) => ({
      plans: { ...s.plans, [plan.date]: plan },
      lastGeneratedAt: new Date().toISOString()
    }));
  },

  toggleTask: async (date, taskId) => {
    await databaseService.toggleTask(date, taskId);

    set((s) => {
      const plan = s.plans[date];
      if (!plan) return s as CoachState;
      const tasks = plan.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t);
      return { plans: { ...s.plans, [date]: { ...plan, tasks } } } as Partial<CoachState>;
    });
  },

  hasGoals: () => get().goals.length > 0,
}));
