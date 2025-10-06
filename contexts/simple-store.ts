import { create } from "zustand";

export type Category = "health" | "study" | "work" | "finance" | "faith" | "personal" | "relationships";
export type Mode = "starter" | "balanced" | "sprint";
export type Locale = "en" | "fr" | "ar";

export type Goal = {
    id: string;
    text: string;
    category?: Category;
    createdAt: number;
    archivedAt?: number;
};

type GoalsState = {
    active: Goal[];
    archived: Goal[];
    addGoal: (text: string) => void;
    archiveGoal: (id: string) => void;
    addGoalsFromStrings: (goals: string[]) => void;
};

type Settings = {
    locale: Locale;
    mode: Mode;
};

type Store = {
    hydrated: boolean;
    pendingGoals: string[];
    setPendingGoals: (g: string[]) => void;

    goals: GoalsState;
    settings: Settings;
    setLocale: (l: Locale) => void;
    setMode: (m: Mode) => void;
};

const stripPII = (s: string) => s.replace(/([\w.+-]+@[\w-]+\.[\w.-]+)/g, "***")
    .replace(/\b(\+?\d[\d\s-]{6,})\b/g, "***")
    .trim();

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export const useAppStore = create<Store>()((set, get) => ({
    hydrated: true,
    pendingGoals: [],
    setPendingGoals: (g) => set({ pendingGoals: g }),

    goals: {
        active: [],
        archived: [],
        addGoal: (text) => {
            const clean = stripPII(text).slice(0, 80);
            const { active } = get().goals;
            if (active.length >= 3 || !clean) return;
            const g: Goal = { id: uid(), text: clean, createdAt: Date.now() };
            set({ goals: { ...get().goals, active: [...active, g] } });
        },
        archiveGoal: (id) => {
            const { active, archived } = get().goals;
            const found = active.find(g => g.id === id);
            if (!found) return;
            found.archivedAt = Date.now();
            set({ goals: { active: active.filter(g => g.id !== id), archived: [found, ...archived] } });
        },
        addGoalsFromStrings: (arr) => {
            const clean = arr.map(s => stripPII(s).slice(0, 80)).filter(Boolean);
            const active = get().goals.active.slice(0, 3);
            const remaining = 3 - active.length;
            const toAdd = clean.slice(0, remaining).map(t => ({ id: uid(), text: t, createdAt: Date.now() } as Goal));
            set({ goals: { ...get().goals, active: [...active, ...toAdd] }, pendingGoals: [] });
        }
    },

    settings: {
        locale: "en",
        mode: "starter"
    },
    setLocale: (l) => set({ settings: { ...get().settings, locale: l } }),
    setMode: (m) => set({ settings: { ...get().settings, mode: m } }),
}));
