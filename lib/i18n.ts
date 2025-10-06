import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../assets/i18n/en.json";
import fr from "../assets/i18n/fr.json";
import ar from "../assets/i18n/ar.json";

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: "v3",
        lng: "en", // Default to English, will be changed by user
        fallbackLng: "en",
        resources: {
            en: { translation: en },
            fr: { translation: fr },
            ar: { translation: ar }
        },
        interpolation: { escapeValue: false },
    });

export default i18n;

