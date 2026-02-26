import { format } from 'date-fns'
import { apiClient, ApiResponse } from './api-client'

// ==========================================
// Types
// ==========================================

export interface DailyReceipt {
    _id: string
    millId: string
    date: string
    voucherNumber: string
    partyName: string
    amount: number
    paymentMode: 'Cash' | 'Bank' | 'Cheque' | 'UPI'
    purpose: string
    status: 'pending' | 'cleared' | 'cancelled' | 'bounced'
    remarks?: string
    createdBy?: { fullName?: string; email?: string }
    updatedBy?: { fullName?: string; email?: string }
    createdAt: string
    updatedAt: string
}

export interface DailyReceiptSummary {
    totalEntries: number
    totalAmount: number
}

export interface DailyReceiptListParams {
    page?: number
    limit?: number
    search?: string
    status?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// API Methods
// ==========================================

export const getDailyReceiptList = async (
    millId: string,
    params?: DailyReceiptListParams
) => {
    const response = await apiClient.get<
        ApiResponse<{
            dailyReceipts: DailyReceipt[]
            pagination: {
                page: number
                limit: number
                total: number
                totalPages: number
                hasPrevPage: boolean
                hasNextPage: boolean
            }
        }>
    >(`/mills/${millId}/daily-receipts`, { params })
    return response.data
}

export const getDailyReceiptSummary = async (
    millId: string,
    params?: { startDate?: string; endDate?: string }
) => {
    const response = await apiClient.get<
        ApiResponse<{ summary: DailyReceiptSummary }>
    >(`/mills/${millId}/daily-receipts/summary`, { params })
    return response.data
}

export const getDailyReceiptById = async (millId: string, id: string) => {
    const response = await apiClient.get<
        ApiResponse<{ dailyReceipt: DailyReceipt }>
    >(`/mills/${millId}/daily-receipts/${id}`)
    return response.data
}

export const createDailyReceipt = async (
    millId: string,
    data: Omit<DailyReceipt, '_id' | 'millId' | 'createdBy' | 'updatedBy' | 'createdAt' | 'updatedAt'>
) => {
    const response = await apiClient.post<
        ApiResponse<{ dailyReceipt: DailyReceipt }>
    >(`/mills/${millId}/daily-receipts`, data)
    return response.data
}

export const updateDailyReceipt = async (
    millId: string,
    id: string,
    data: Partial<DailyReceipt>
) => {
    const response = await apiClient.put<
        ApiResponse<{ dailyReceipt: DailyReceipt }>
    >(`/mills/${millId}/daily-receipts/${id}`, data)
    return response.data
}

export const deleteDailyReceipt = async (millId: string, id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(
        `/mills/${millId}/daily-receipts/${id}`
    )
    return response.data
}

export const bulkDeleteDailyReceipts = async (
    millId: string,
    ids: string[]
) => {
    const response = await apiClient.delete<
        ApiResponse<{ deletedCount: number }>
    >(`/mills/${millId}/daily-receipts/bulk`, { data: { ids } })
    return response.data
}

// ==========================================
// Utility
// ==========================================

export const formatDateForApi = (date: Date): string => {
    return format(date, 'yyyy-MM-dd')
}

export const exportDailyReceiptsAsCsv = (
    data: DailyReceipt[],
    baseFilename: string
) => {
    const headers = [
        'Date',
        'Voucher No.',
        'Party Name',
        'Amount (₹)',
        'Payment Mode',
        'Purpose',
        'Status',
        'Remarks',
    ]
    const rows = data.map((item) => [
        typeof item.date === 'string'
            ? item.date.split('T')[0]
            : format(new Date(item.date), 'yyyy-MM-dd'),
        item.voucherNumber,
        item.partyName,
        item.amount.toFixed(2),
        item.paymentMode,
        item.purpose,
        item.status,
        item.remarks || '',
    ])

    const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
            row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${baseFilename}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
}
