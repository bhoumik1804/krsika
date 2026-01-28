/**
 * Centralized Constants for Rice Mill SaaS Platform
 * ================================================
 * All application-wide constants should be defined here.
 * This ensures a single source of truth and easy maintenance.
 */

// ==========================================
// User Roles
// ==========================================

/** Available user roles in the system */
export const USER_ROLES = ['super-admin', 'mill-admin', 'mill-staff'] as const

/** User role type derived from USER_ROLES constant */
export type UserRole = (typeof USER_ROLES)[number]

/** Default role when none is specified or invalid */
export const DEFAULT_ROLE: UserRole = 'super-admin'

/** Human-readable display names for roles */
export const ROLE_DISPLAY_NAMES: Readonly<Record<UserRole, string>> = {
    'super-admin': 'Super Admin',
    'mill-admin': 'Mill Admin',
    'mill-staff': 'Mill Staff',
} as const

// ==========================================
// Route Prefixes
// ==========================================

/** Route prefixes for different dashboards */
export const ROUTE_PREFIXES = {
    ADMIN: '/admin',
    MILL: '/mill',
    STAFF: '/staff',
    AUTH: '/auth',
} as const

/** Route prefix type */
export type RoutePrefix = (typeof ROUTE_PREFIXES)[keyof typeof ROUTE_PREFIXES]

// ==========================================
// API Configuration
// ==========================================

/** API base URL - defaults to environment variable or localhost */
export const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/** API version */
export const API_VERSION = 'v1'

/** Full API URL */
export const API_URL = `${API_BASE_URL}/${API_VERSION}`

// ==========================================
// Pagination
// ==========================================

/** Default pagination settings */
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100] as const,
    MAX_PAGE_SIZE: 100,
} as const

// ==========================================
// Date & Time Formats
// ==========================================

/** Date format patterns */
export const DATE_FORMATS = {
    DISPLAY: 'DD MMM YYYY',
    DISPLAY_SHORT: 'DD/MM/YY',
    INPUT: 'YYYY-MM-DD',
    DATETIME: 'DD MMM YYYY, hh:mm A',
    TIME: 'hh:mm A',
    ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
} as const

// ==========================================
// Currency & Locale
// ==========================================

/** Currency settings */
export const CURRENCY = {
    CODE: 'INR',
    SYMBOL: '₹',
    LOCALE: 'en-IN',
} as const

/** Format currency amount */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat(CURRENCY.LOCALE, {
        style: 'currency',
        currency: CURRENCY.CODE,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount)
}

// ==========================================
// Toast/Notification Durations
// ==========================================

/** Toast notification durations in milliseconds */
export const TOAST_DURATION = {
    SHORT: 2000,
    DEFAULT: 4000,
    LONG: 6000,
    PERSISTENT: 0, // Won't auto-dismiss
} as const

// ==========================================
// File Upload
// ==========================================

/** File upload configuration */
export const FILE_UPLOAD = {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'] as const,
} as const

// ==========================================
// Stock/Inventory Types
// ==========================================

/** Stock types available in the system */
export const STOCK_TYPES = ['paddy', 'rice', 'bran', 'husk', 'broken'] as const
export type StockType = (typeof STOCK_TYPES)[number]

/** Stock type display names */
export const STOCK_TYPE_NAMES: Readonly<Record<StockType, string>> = {
    paddy: 'Paddy',
    rice: 'Rice',
    bran: 'Rice Bran',
    husk: 'Rice Husk',
    broken: 'Broken Rice',
} as const

// ==========================================
// Quality Grades
// ==========================================

/** Quality grades for stock */
export const QUALITY_GRADES = ['A', 'B', 'C', 'D'] as const
export type QualityGrade = (typeof QUALITY_GRADES)[number]

// ==========================================
// Payment Modes
// ==========================================

/** Available payment modes */
export const PAYMENT_MODES = [
    'cash',
    'upi',
    'bank',
    'credit',
    'cheque',
] as const
export type PaymentMode = (typeof PAYMENT_MODES)[number]

/** Payment mode display names */
export const PAYMENT_MODE_NAMES: Readonly<Record<PaymentMode, string>> = {
    cash: 'Cash',
    upi: 'UPI',
    bank: 'Bank Transfer',
    credit: 'Credit',
    cheque: 'Cheque',
} as const

// ==========================================
// Transaction Status
// ==========================================

/** Transaction status values */
export const TRANSACTION_STATUS = [
    'pending',
    'completed',
    'cancelled',
    'partial',
] as const
export type TransactionStatus = (typeof TRANSACTION_STATUS)[number]

// ==========================================
// Subscription Plans
// ==========================================

/** Subscription billing cycles */
export const BILLING_CYCLES = ['monthly', 'yearly'] as const
export type BillingCycle = (typeof BILLING_CYCLES)[number]

/** Subscription plan slugs */
export const PLAN_SLUGS = ['basic', 'professional', 'enterprise'] as const
export type PlanSlug = (typeof PLAN_SLUGS)[number]

// ==========================================
// App Metadata
// ==========================================

/** Application metadata */
export const APP_META = {
    NAME: 'Rice Mill SaaS',
    SHORT_NAME: 'RiceMill',
    DESCRIPTION: 'The complete cloud platform for modern rice mill operations',
    VERSION: '1.0.0',
    CONTACT_EMAIL: 'support@ricemillsaas.com',
    CONTACT_PHONE: '+91 98765 43210',
} as const

// ==========================================
// Local Storage Keys
// ==========================================

/** Local storage keys for consistent access */
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
    THEME: 'theme',
    SIDEBAR_STATE: 'sidebar_state',
    LAYOUT_STATE: 'layout_state',
} as const

// ==========================================
// Cookie Names
// ==========================================

/** Cookie names for consistent access */
export const COOKIE_NAMES = {
    SIDEBAR_STATE: 'sidebar_state',
    THEME: 'theme',
} as const


export const EXPORT_FILE_TYPES = ['csv', 'xlsx', 'pdf'] as const
export type ExportFileType = (typeof EXPORT_FILE_TYPES)[number]

export const IMPORT_FILE_TYPES = ['csv', 'xlsx'] as const
export type ImportFileType = (typeof IMPORT_FILE_TYPES)[number]
