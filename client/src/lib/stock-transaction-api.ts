import { format } from 'date-fns'
import { apiClient, ApiResponse } from './api-client'

// ==========================================
// Types
// ==========================================

export interface StockTransaction {
    _id: string
    millId: string
    date: string
    commodity: string
    variety?: string | null
    type: 'CREDIT' | 'DEBIT'
    action: string
    quantity: number
    bags: number
    refModel?: string
    refId?: string
    remarks?: string | null
    createdBy?: string
    createdAt: string
    updatedAt: string
}

export interface StockBalance {
    commodity: string
    variety: string | null
    creditTotal: number
    debitTotal: number
    balance: number
    totalBags: number
}

export interface StockByAction {
    commodity: string
    variety: string | null
    totalQuantity: number
    totalBags: number
    count: number
}

export interface StockTransactionSummary {
    totalTransactions: number
    totalCredit: number
    totalDebit: number
    netMovement: number
    totalBags: number
}

export interface GetStockTransactionsParams {
    page?: number
    limit?: number
    commodity?: string
    variety?: string
    type?: 'CREDIT' | 'DEBIT'
    action?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export interface GetStockByActionParams {
    action: string
    startDate?: string
    endDate?: string
}

// ==========================================
// API Methods
// ==========================================

/**
 * Get stock transactions grouped by commodity+variety for a specific action and date range.
 * This is the primary endpoint used by daily report pages.
 */
export const getStockByAction = async (
    millId: string,
    params: GetStockByActionParams
) => {
    const response = await apiClient.get<
        ApiResponse<{ stocks: StockByAction[] }>
    >(`/mills/${millId}/stock-transactions/by-action`, { params })
    return response.data
}

/**
 * Get current stock balance grouped by commodity and variety
 * Pass asOfDate (YYYY-MM-DD) for historical balance snapshot
 */
export const getStockBalance = async (
    millId: string,
    params?: {
        commodity?: string
        variety?: string
        asOfDate?: string
    }
) => {
    const response = await apiClient.get<
        ApiResponse<{ balances: StockBalance[] }>
    >(`/mills/${millId}/stock-transactions/balance`, { params })
    return response.data
}

/**
 * Get stock transaction summary with statistics
 */
export const getStockTransactionSummary = async (
    millId: string,
    params?: {
        startDate?: string
        endDate?: string
        commodity?: string
        variety?: string
    }
) => {
    const response = await apiClient.get<
        ApiResponse<{ summary: StockTransactionSummary }>
    >(`/mills/${millId}/stock-transactions/summary`, { params })
    return response.data
}

/**
 * Get stock transaction list with pagination and filters
 */
export const getStockTransactions = async (
    millId: string,
    params?: GetStockTransactionsParams
) => {
    const response = await apiClient.get<
        ApiResponse<{ transactions: StockTransaction[] }>
    >(`/mills/${millId}/stock-transactions`, { params })
    return response.data
}

/**
 * Get stock transaction by ID
 */
export const getStockTransactionById = async (millId: string, id: string) => {
    const response = await apiClient.get<
        ApiResponse<{ transaction: StockTransaction }>
    >(`/mills/${millId}/stock-transactions/${id}`)
    return response.data
}

// ==========================================
// Utility: Date Formatting
// ==========================================

/**
 * Format a Date object to YYYY-MM-DD string for API queries
 */
export const formatDateForApi = (date: Date): string => {
    return format(date, 'yyyy-MM-dd')
}

// ==========================================
// Utility: CSV Export
// ==========================================

/**
 * Build filename with optional date range suffix
 */
const buildExportFilename = (
    base: string,
    startDate?: string,
    endDate?: string
): string => {
    if (startDate && endDate) return `${base}-${startDate}_to_${endDate}`
    if (startDate) return `${base}-${startDate}`
    return base
}

/**
 * Export stock data as CSV and trigger download
 */
export const exportStockDataAsCsv = (
    data: StockByAction[],
    baseFilename: string,
    dateRange?: { startDate?: string; endDate?: string }
) => {
    const headers = [
        'Commodity',
        'Variety',
        'Quantity (Qtl)',
        'Bags',
        'Transactions',
    ]
    const rows = data.map((item) => [
        item.commodity,
        item.variety || '-',
        item.totalQuantity.toFixed(2),
        item.totalBags.toString(),
        item.count.toString(),
    ])

    const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
            row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ),
    ].join('\n')

    const filename = buildExportFilename(
        baseFilename,
        dateRange?.startDate,
        dateRange?.endDate
    )
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
}

/**
 * Export stock balance data as CSV and trigger download
 */
export const exportStockBalanceAsCsv = (
    data: StockBalance[],
    baseFilename: string,
    asOfDate?: string
) => {
    const headers = [
        'Commodity',
        'Variety',
        'Credit (Qtl)',
        'Debit (Qtl)',
        'Balance (Qtl)',
        'Total Bags',
    ]
    const rows = data.map((item) => [
        item.commodity,
        item.variety || '-',
        item.creditTotal.toFixed(2),
        item.debitTotal.toFixed(2),
        item.balance.toFixed(2),
        item.totalBags.toString(),
    ])

    const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
            row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ),
    ].join('\n')

    const filename = asOfDate
        ? `${baseFilename}-as-of-${asOfDate}`
        : baseFilename
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
}

/**
 * Export date-wise transaction history as CSV
 */
export const exportStockTransactionsAsCsv = (
    data: StockTransaction[],
    baseFilename: string,
    dateRange?: { startDate?: string; endDate?: string }
) => {
    const headers = [
        'Date',
        'Commodity',
        'Variety',
        'Type',
        'Action',
        'Quantity (Qtl)',
        'Bags',
        'Remarks',
    ]
    const rows = data.map((item) => [
        typeof item.date === 'string'
            ? item.date.split('T')[0]
            : format(new Date(item.date), 'yyyy-MM-dd'),
        item.commodity,
        item.variety || '-',
        item.type,
        item.action,
        item.quantity.toFixed(2),
        item.bags.toString(),
        (item.remarks || '').replace(/"/g, '""'),
    ])

    const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
            row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ),
    ].join('\n')

    const filename = buildExportFilename(
        baseFilename,
        dateRange?.startDate,
        dateRange?.endDate
    )
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
}
