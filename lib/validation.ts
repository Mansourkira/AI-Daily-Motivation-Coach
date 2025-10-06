export function sanitizeGoal(s: string) {
    if (!s) return "";
    const redacted = s.replace(/([\w.+-]+@[\w-]+\.[\w.-]+)/g, "***").replace(/\b(\+?\d[\d\s-]{6,})\b/g, "***");
    return redacted.trim().slice(0, 80);
}

