export const categories = ["health", "study", "work", "finance", "faith", "personal", "relationships"] as const;

const bank: Record<string, string[]> = {
    health: ["Walk 20 min", "Sleep by 23:30", "2L water", "Home workout 15 min"],
    study: ["Read 10 pages", "Pomodoro ×3", "New vocab ×20"],
    work: ["Deep work 25 min", "Inbox zero once", "Plan tomorrow in 5 min"],
    finance: ["Save 10 TND/day", "Track expenses", "No delivery today"],
    faith: ["Prayer on time", "Qur'an 1 page", "Morning dhikr"],
    personal: ["No social 1h", "Journal 3 lines", "Call family"],
    relationships: ["Text a friend", "Plan a coffee", "Say thank you today"],
};

export function getTemplatesFor(cat: string) {
    return bank[cat] ?? [];
}

