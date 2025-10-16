import { create } from 'zustand';

export type Locale = 'en' | 'fr' | 'ar';

export type OnboardingState = {
    // Temporary onboarding data
    locale: Locale;
    focusAreas: string[];
    goals: Array<{ text: string; isCustom: boolean }>;
    name: string;
    notifications: boolean;

    // Actions
    setLocale: (locale: Locale) => void;
    setFocusAreas: (areas: string[]) => void;
    addGoal: (text: string, isCustom?: boolean) => void;
    removeGoal: (text: string) => void;
    setName: (name: string) => void;
    setNotifications: (enabled: boolean) => void;
    reset: () => void;
};

const initialState = {
    locale: 'en' as Locale,
    focusAreas: [],
    goals: [],
    name: '',
    notifications: false,
};

export const useOnboarding = create<OnboardingState>((set) => ({
    ...initialState,

    setLocale: (locale) => set({ locale }),

    setFocusAreas: (areas) => {
        // Enforce max 3 focus areas
        if (areas.length > 3) {
            areas = areas.slice(0, 3);
        }
        set({ focusAreas: areas });
    },

    addGoal: (text, isCustom = false) =>
        set((state) => {
            // Enforce max 3 goals
            if (state.goals.length >= 3) {
                return state;
            }
            // Check if goal already exists
            if (state.goals.some((g) => g.text === text)) {
                return state;
            }
            return {
                goals: [...state.goals, { text, isCustom }],
            };
        }),

    removeGoal: (text) =>
        set((state) => ({
            goals: state.goals.filter((g) => g.text !== text),
        })),

    setName: (name) => set({ name }),

    setNotifications: (enabled) => set({ notifications: enabled }),

    reset: () => set(initialState),
}));

