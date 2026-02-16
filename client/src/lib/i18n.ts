// Import translation files
import enMillStaff from '@/locales/en/mill-staff.json'
import hiMillStaff from '@/locales/hi/mill-staff.json'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
    en: {
        millStaff: enMillStaff,
    },
    hi: {
        millStaff: hiMillStaff,
    },
}

// Get stored language or default to 'hi'
const getStoredLanguage = (): string => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('language') || 'hi'
    }
    return 'hi'
}

i18n.use(initReactI18next).init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    defaultNS: 'millStaff',
    ns: ['millStaff'],
    interpolation: {
        escapeValue: false, // React already escapes values
    },
    react: {
        useSuspense: false,
    },
})

// Function to change language and persist
export const changeLanguage = (lang: 'en' | 'hi') => {
    i18n.changeLanguage(lang)
    if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang)
    }
}

// Get current language
export const getCurrentLanguage = (): 'en' | 'hi' => {
    return (i18n.language as 'en' | 'hi') || 'en'
}

export default i18n
