// Import translation files
import enMillStaff from '@/locales/en/mill-staff.json'
import hiMillStaff from '@/locales/hi/mill-staff.json'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
    en: {
        'mill-staff': enMillStaff,
    },
    hi: {
        'mill-staff': hiMillStaff,
    },
}

// Get stored language or default to 'hi'
const getStoredLanguage = (): string => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('language') || 'hi'
    }
    return 'hi'
}

const PLACEHOLDER_EN_FORCE_FLAG = '__placeholder_en_force__'

const millStaffPlaceholderEnglishPostProcessor = {
    name: 'millStaffPlaceholderEnglish',
    type: 'postProcessor' as const,
    process: (value: string, key: string | string[], options: any) => {
        const keyList = Array.isArray(key) ? key : [key]
        const hasPlaceholderKey = keyList.some(
            (k) => typeof k === 'string' && /placeholder/i.test(k)
        )

        if (!hasPlaceholderKey) return value
        if (options?.[PLACEHOLDER_EN_FORCE_FLAG]) return value

        const nsOption = options?.ns
        const nsList = Array.isArray(nsOption)
            ? nsOption
            : nsOption
              ? [nsOption]
              : ['mill-staff']

        if (!nsList.includes('mill-staff')) return value
        if (i18n.language === 'en') return value

        return i18n.t(keyList[0], {
            ...options,
            lng: 'en',
            postProcess: [],
            [PLACEHOLDER_EN_FORCE_FLAG]: true,
        })
    },
}

i18n.use(millStaffPlaceholderEnglishPostProcessor as any)
i18n.use(initReactI18next).init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    defaultNS: 'mill-staff',
    ns: ['mill-staff'],
    interpolation: {
        escapeValue: false, // React already escapes values
    },
    react: {
        useSuspense: false,
    },
    postProcess: ['millStaffPlaceholderEnglish'],
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
