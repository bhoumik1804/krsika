/**
 * Financial Payment Service
 * API client for Financial Payment CRUD operations
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    FinancialPaymentResponse,
    FinancialPaymentListResponse,
    FinancialPaymentSummaryResponse,
    CreateFinancialPaymentRequest,
    UpdateFinancialPaymentRequest,
    FinancialPaymentQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const FINANCIAL_PAYMENT_ENDPOINT = (millId: string) =>
    `/mills/${millId}/financial-payments`

// ==========================================
// Financial Payment API Functions
// ==========================================

/**
 * Fetch all financial payment entries with pagination and filters
 */
export const fetchFinancialPaymentList = async (
    millId: string,
    params?: FinancialPaymentQueryParams
): Promise<FinancialPaymentListResponse> => {
    const response = await apiClient.get<
        ApiResponse<FinancialPaymentListResponse>
    >(FINANCIAL_PAYMENT_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single financial payment entry by ID
 */
export const fetchFinancialPaymentById = async (
    millId: string,
    id: string
): Promise<FinancialPaymentResponse> => {
    const response = await apiClient.get<ApiResponse<FinancialPaymentResponse>>(
        `${FINANCIAL_PAYMENT_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch financial payment summary/statistics
 */
export const fetchFinancialPaymentSummary = async (
    millId: string,
    params?: Pick<FinancialPaymentQueryParams, 'startDate' | 'endDate'>
): Promise<FinancialPaymentSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<FinancialPaymentSummaryResponse>
    >(`${FINANCIAL_PAYMENT_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new financial payment entry
 */
export const createFinancialPayment = async (
    millId: string,
    data: CreateFinancialPaymentRequest
): Promise<FinancialPaymentResponse> => {
    const response = await apiClient.post<
        ApiResponse<FinancialPaymentResponse>
    >(FINANCIAL_PAYMENT_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing financial payment entry
 */
export const updateFinancialPayment = async (
    millId: string,
    { id, ...data }: UpdateFinancialPaymentRequest
): Promise<FinancialPaymentResponse> => {
    const response = await apiClient.put<ApiResponse<FinancialPaymentResponse>>(
        `${FINANCIAL_PAYMENT_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a financial payment entry
 */
export const deleteFinancialPayment = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${FINANCIAL_PAYMENT_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete financial payment entries
 */
export const bulkDeleteFinancialPayment = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${FINANCIAL_PAYMENT_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}
