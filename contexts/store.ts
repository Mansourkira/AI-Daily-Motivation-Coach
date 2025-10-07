import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid/non-secure';

export type Locale = 'en'|'fr'|'ar';
export type Focus = 'health'|'study'|'work'|'finance'|'faith'|'personal'|'relationships'|string;

export type Goal = { id: string; text: string; createdAt: string; archivedAt?: string; };
export type DailyTask = { id: string; text: string; at?: string; done: boolean; };
export type DailyPlan = { id: string; date: string; tasks: DailyTask[]; sourcePromptHash?: string; };

export type Settings = {
  locale: Locale;
  wakeTime: string;      // "07:00"
  focusAreas: Focus[];   // up to 3
  notifications: boolean;
  name?: string;
  adsConsent?: 'granted'|'denied'|'not_set';
};

type CoachState = {
  onboardingDone?: boolean; // undefined until hydrate
  goals: Goal[];
  settings: Settings;
  plans: Record<string, DailyPlan>; // date -> plan
  lastGeneratedAt?: string;

  // actions
  setOnboardingDone: (v: boolean) => void;
  setSettings: (patch: Partial<Settings>) => void;
  addGoal: (text: string) => void;
  removeGoal: (id: string) => void;
  savePlan: (plan: DailyPlan) => void;
  toggleTask: (date: string, taskId: string) => void;
  hasGoals: () => boolean;
};

const defaultSettings: Settings = {
  locale: 'en',
  wakeTime: '07:00',
  focusAreas: [],
  notifications: false,
  adsConsent: 'not_set',
};

export const useCoach = create<CoachState>()(
  persist(
    (set, get) => ({
      onboardingDone: false,
      goals: [],
      settings: defaultSettings,
      plans: {},

      setOnboardingDone: (v) => set({ onboardingDone: v }),
      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      addGoal: (text) => set((s) => ({
        goals: [...s.goals, { id: nanoid(), text: text.trim().slice(0, 80), createdAt: new Date().toISOString() }]
      })),
      removeGoal: (id) => set((s) => ({ goals: s.goals.filter(g => g.id !== id) })),

      savePlan: (plan) => set((s) => ({
        plans: { ...s.plans, [plan.date]: plan },
        lastGeneratedAt: new Date().toISOString()
      })),

      toggleTask: (date, taskId) => set((s) => {
        const plan = s.plans[date];
        if (!plan) return s as CoachState;
        const tasks = plan.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t);
        return { plans: { ...s.plans, [date]: { ...plan, tasks } } } as Partial<CoachState>;
      }),

      hasGoals: () => get().goals.length > 0,
    }),
    { name: 'ai-daily-coach', storage: createJSONStorage(() => AsyncStorage) }
  )
);
