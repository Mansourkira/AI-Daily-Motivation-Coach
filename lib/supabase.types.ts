// Database types for Supabase
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    created_at: string;
                    updated_at: string;
                    onboarding_done: boolean;
                    name: string | null;
                };
                Insert: {
                    id: string;
                    created_at?: string;
                    updated_at?: string;
                    onboarding_done?: boolean;
                    name?: string | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    onboarding_done?: boolean;
                    name?: string | null;
                };
            };
            settings: {
                Row: {
                    id: string;
                    user_id: string;
                    created_at: string;
                    updated_at: string;
                    locale: 'en' | 'fr' | 'ar';
                    wake_time: string;
                    focus_areas: string[];
                    notifications: boolean;
                    ads_consent: 'granted' | 'denied' | 'not_set';
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    created_at?: string;
                    updated_at?: string;
                    locale?: 'en' | 'fr' | 'ar';
                    wake_time?: string;
                    focus_areas?: string[];
                    notifications?: boolean;
                    ads_consent?: 'granted' | 'denied' | 'not_set';
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    created_at?: string;
                    updated_at?: string;
                    locale?: 'en' | 'fr' | 'ar';
                    wake_time?: string;
                    focus_areas?: string[];
                    notifications?: boolean;
                    ads_consent?: 'granted' | 'denied' | 'not_set';
                };
            };
            goals: {
                Row: {
                    id: string;
                    user_id: string;
                    created_at: string;
                    text: string;
                    archived_at: string | null;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    created_at?: string;
                    text: string;
                    archived_at?: string | null;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    created_at?: string;
                    text?: string;
                    archived_at?: string | null;
                };
            };
            plans: {
                Row: {
                    id: string;
                    user_id: string;
                    created_at: string;
                    date: string;
                    source_prompt_hash: string | null;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    created_at?: string;
                    date: string;
                    source_prompt_hash?: string | null;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    created_at?: string;
                    date?: string;
                    source_prompt_hash?: string | null;
                };
            };
            tasks: {
                Row: {
                    id: string;
                    plan_id: string;
                    created_at: string;
                    text: string;
                    at: string | null;
                    done: boolean;
                    order_index: number;
                };
                Insert: {
                    id?: string;
                    plan_id: string;
                    created_at?: string;
                    text: string;
                    at?: string | null;
                    done?: boolean;
                    order_index: number;
                };
                Update: {
                    id?: string;
                    plan_id?: string;
                    created_at?: string;
                    text?: string;
                    at?: string | null;
                    done?: boolean;
                    order_index?: number;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
}

