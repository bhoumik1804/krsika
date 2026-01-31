/**
 * Financial Receipt Service
 * API client for Financial Receipt CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    FinancialReceiptResponse,
    FinancialReceiptListResponse,
    FinancialReceiptSummaryResponse,
    CreateFinancialReceiptRequest,
    UpdateFinancialReceiptRequest,
    FinancialReceiptQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const FINANCIAL_RECEIPT_ENDPOINT = (millId: string) =>
    `/mills/${millId}/financial-receipts`

// ==========================================
// Financial Receipt API Functions
// ==========================================

/**
 * Fetch all financial receipt entries with pagination and filters
 */
export const fetchFinancialReceiptList = async (
    millId: string,
    params?: FinancialReceiptQueryParams
): Promise<FinancialReceiptListResponse> => {
    const response = await apiClient.get<
        ApiResponse<FinancialReceiptListResponse>
    >(FINANCIAL_RECEIPT_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single financial receipt entry by ID
 */
export const fetchFinancialReceiptById = async (
    millId: string,
    id: string
): Promise<FinancialReceiptResponse> => {
    const response = await apiClient.get<ApiResponse<FinancialReceiptResponse>>(
        `${FINANCIAL_RECEIPT_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch financial receipt summary/statistics
 */
export const fetchFinancialReceiptSummary = async (
    millId: string,
    params?: Pick<FinancialReceiptQueryParams, 'startDate' | 'endDate'>
): Promise<FinancialReceiptSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<FinancialReceiptSummaryResponse>
    >(`${FINANCIAL_RECEIPT_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new financial receipt entry
 */
export const createFinancialReceipt = async (
    millId: string,
    data: CreateFinancialReceiptRequest
): Promise<FinancialReceiptResponse> => {
    const response = await apiClient.post<
        ApiResponse<FinancialReceiptResponse>
    >(FINANCIAL_RECEIPT_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing financial receipt entry
 */
export const updateFinancialReceipt = async (
    millId: string,
    { id, ...data }: UpdateFinancialReceiptRequest
): Promise<FinancialReceiptResponse> => {
    const response = await apiClient.put<ApiResponse<FinancialReceiptResponse>>(
        `${FINANCIAL_RECEIPT_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a financial receipt entry
 */
export const deleteFinancialReceipt = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${FINANCIAL_RECEIPT_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete financial receipt entries
 */
export const bulkDeleteFinancialReceipt = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${FINANCIAL_RECEIPT_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export financial receipt entries to CSV/Excel
 */
export const exportFinancialReceipt = async (
    millId: string,
    params?: FinancialReceiptQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${FINANCIAL_RECEIPT_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
