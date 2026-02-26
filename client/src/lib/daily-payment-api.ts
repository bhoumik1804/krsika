import { format } from 'date-fns'
import { apiClient, ApiResponse } from './api-client'

// ==========================================
// Types
// ==========================================

export interface DailyPayment {
    _id: string
    millId: string
    date: string
    voucherNumber: string
    partyName: string
    amount: number
    paymentMode: 'Cash' | 'Bank' | 'Cheque' | 'UPI'
    purpose: string
    referenceNumber?: string
    status: 'pending' | 'completed' | 'cancelled' | 'failed'
    remarks?: string
    createdBy?: { fullName?: string; email?: string }
    updatedBy?: { fullName?: string; email?: string }
    createdAt: string
    updatedAt: string
}

export interface DailyPaymentSummary {
    totalEntries: number
    totalAmount: number
}

export interface DailyPaymentListParams {
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

export const getDailyPaymentList = async (
    millId: string,
    params?: DailyPaymentListParams
) => {
    const response = await apiClient.get<
        ApiResponse<{
            dailyPayments: DailyPayment[]
            pagination: {
                page: number
                limit: number
                total: number
                totalPages: number
                hasPrevPage: boolean
                hasNextPage: boolean
            }
        }>
    >(`/mills/${millId}/daily-payments`, { params })
    return response.data
}

export const getDailyPaymentSummary = async (
    millId: string,
    params?: { startDate?: string; endDate?: string }
) => {
    const response = await apiClient.get<
        ApiResponse<{ summary: DailyPaymentSummary }>
    >(`/mills/${millId}/daily-payments/summary`, { params })
    return response.data
}

export const getDailyPaymentById = async (millId: string, id: string) => {
    const response = await apiClient.get<
        ApiResponse<{ dailyPayment: DailyPayment }>
    >(`/mills/${millId}/daily-payments/${id}`)
    return response.data
}

export const createDailyPayment = async (
    millId: string,
    data: Omit<DailyPayment, '_id' | 'millId' | 'createdBy' | 'updatedBy' | 'createdAt' | 'updatedAt'>
) => {
    const response = await apiClient.post<
        ApiResponse<{ dailyPayment: DailyPayment }>
    >(`/mills/${millId}/daily-payments`, data)
    return response.data
}

export const updateDailyPayment = async (
    millId: string,
    id: string,
    data: Partial<DailyPayment>
) => {
    const response = await apiClient.put<
        ApiResponse<{ dailyPayment: DailyPayment }>
    >(`/mills/${millId}/daily-payments/${id}`, data)
    return response.data
}

export const deleteDailyPayment = async (millId: string, id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(
        `/mills/${millId}/daily-payments/${id}`
    )
    return response.data
}

export const bulkDeleteDailyPayments = async (
    millId: string,
    ids: string[]
) => {
    const response = await apiClient.delete<
        ApiResponse<{ deletedCount: number }>
    >(`/mills/${millId}/daily-payments/bulk`, { data: { ids } })
    return response.data
}

// ==========================================
// Utility
// ==========================================

export const formatDateForApi = (date: Date): string => {
    return format(date, 'yyyy-MM-dd')
}

export const exportDailyPaymentsAsCsv = (
    data: DailyPayment[],
    baseFilename: string
) => {
    const headers = [
        'Date',
        'Voucher No.',
        'Party Name',
        'Amount (₹)',
        'Payment Mode',
        'Purpose',
        'Reference No.',
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
        item.referenceNumber || '',
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
