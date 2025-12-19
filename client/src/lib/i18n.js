import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import commonEN from '@/locales/en/common.json';
import commonHI from '@/locales/hi/common.json';
import studentsEN from '@/locales/en/students.json';
import studentsHI from '@/locales/hi/students.json';
import entryEN from '@/locales/en/entry.json';
import entryHI from '@/locales/hi/entry.json';
import reportsEN from '@/locales/en/reports.json';
import reportsHI from '@/locales/hi/reports.json';
import formsEN from '@/locales/en/forms.json';
import formsHI from '@/locales/hi/forms.json';
import tablesEN from '@/locales/en/tables.json';
import tablesHI from '@/locales/hi/tables.json';

// Configure i18n
i18n
    // Detect user language
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
        // Resources containing translations
        resources: {
            en: {
                common: commonEN,
                students: studentsEN,
                entry: entryEN,
                reports: reportsEN,
                forms: formsEN,
                tables: tablesEN,
            },
            hi: {
                common: commonHI,
                students: studentsHI,
                entry: entryHI,
                reports: reportsHI,
                forms: formsHI,
                tables: tablesHI,
            },
        },

        // Default language - Hindi
        fallbackLng: 'hi',
        lng: 'hi', // Force Hindi as default

        // Debug mode (only in development)
        debug: import.meta.env.DEV,

        // Default namespace
        defaultNS: 'common',

        // Language detection options
        detection: {
            // Order of language detection methods
            order: ['localStorage', 'navigator'],
            // Keys to lookup language from localStorage
            caches: ['localStorage'],
            // Key name in localStorage
            lookupLocalStorage: 'i18nextLng',
        },

        // Interpolation options
        interpolation: {
            escapeValue: false, // React already escapes values
        },

        // React options
        react: {
            useSuspense: false, // Disable suspense for simpler setup
        },
    });

export default i18n;
