import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationResult,
    type UseQueryResult,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    bulkDeleteFinancialReceipt,
    createFinancialReceipt,
    deleteFinancialReceipt,
    fetchFinancialReceiptById,
    fetchFinancialReceiptList,
    fetchFinancialReceiptSummary,
    updateFinancialReceipt,
} from './service'
import type {
    CreateFinancialReceiptRequest,
    FinancialReceiptListResponse,
    FinancialReceiptQueryParams,
    FinancialReceiptResponse,
    FinancialReceiptSummaryResponse,
    UpdateFinancialReceiptRequest,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const financialReceiptKeys = {
    all: ['financial-receipt'] as const,
    lists: () => [...financialReceiptKeys.all, 'list'] as const,
    list: (millId: string, params?: FinancialReceiptQueryParams) =>
        [...financialReceiptKeys.lists(), millId, params] as const,
    details: () => [...financialReceiptKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...financialReceiptKeys.details(), millId, id] as const,
    summaries: () => [...financialReceiptKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<FinancialReceiptQueryParams, 'startDate' | 'endDate'>
    ) => [...financialReceiptKeys.summaries(), millId, params] as const,
}

// ==========================================
// Hooks
// ==========================================

/**
 * Hook to fetch financial receipt list
 */
export const useFinancialReceiptList = (
    millId: string,
    params?: FinancialReceiptQueryParams
): UseQueryResult<FinancialReceiptListResponse, Error> => {
    return useQuery({
        queryKey: financialReceiptKeys.list(millId, params),
        queryFn: () => fetchFinancialReceiptList(millId, params),
        enabled: !!millId,
    })
}

/**
 * Hook to fetch a single financial receipt by ID
 */
export const useFinancialReceipt = (
    millId: string,
    id: string
): UseQueryResult<FinancialReceiptResponse, Error> => {
    return useQuery({
        queryKey: financialReceiptKeys.detail(millId, id),
        queryFn: () => fetchFinancialReceiptById(millId, id),
        enabled: !!millId && !!id,
    })
}

/**
 * Hook to fetch financial receipt summary
 */
export const useFinancialReceiptSummary = (
    millId: string,
    params?: Pick<FinancialReceiptQueryParams, 'startDate' | 'endDate'>
): UseQueryResult<FinancialReceiptSummaryResponse, Error> => {
    return useQuery({
        queryKey: financialReceiptKeys.summary(millId, params),
        queryFn: () => fetchFinancialReceiptSummary(millId, params),
        enabled: !!millId,
    })
}

/**
 * Hook to create a new financial receipt
 */
export const useCreateFinancialReceipt = (): UseMutationResult<
    FinancialReceiptResponse,
    Error,
    { millId: string; data: CreateFinancialReceiptRequest }
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ millId, data }) => createFinancialReceipt(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: financialReceiptKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: financialReceiptKeys.summaries(),
            })
            toast.success('Financial receipt created successfully')
        },
        onError: (error) => {
            toast.error(
                `Failed to create financial receipt: ${error.message || 'Unknown error'}`
            )
        },
    })
}

/**
 * Hook to update existing financial receipt
 */
export const useUpdateFinancialReceipt = (): UseMutationResult<
    FinancialReceiptResponse,
    Error,
    { millId: string; data: UpdateFinancialReceiptRequest }
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ millId, data }) => updateFinancialReceipt(millId, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: financialReceiptKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: financialReceiptKeys.detail(
                    variables.millId,
                    data._id!
                ),
            })
            queryClient.invalidateQueries({
                queryKey: financialReceiptKeys.summaries(),
            })
            toast.success('Financial receipt updated successfully')
        },
        onError: (error) => {
            toast.error(
                `Failed to update financial receipt: ${error.message || 'Unknown error'}`
            )
        },
    })
}

/**
 * Hook to delete a financial receipt
 */
export const useDeleteFinancialReceipt = (): UseMutationResult<
    void,
    Error,
    { millId: string; id: string }
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ millId, id }) => deleteFinancialReceipt(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: financialReceiptKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: financialReceiptKeys.summaries(),
            })
            toast.success('Financial receipt deleted successfully')
        },
        onError: (error) => {
            toast.error(
                `Failed to delete financial receipt: ${error.message || 'Unknown error'}`
            )
        },
    })
}

/**
 * Hook to bulk delete financial receipt entries
 */
export const useBulkDeleteFinancialReceipt = (): UseMutationResult<
    void,
    Error,
    { millId: string; ids: string[] }
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ millId, ids }) =>
            bulkDeleteFinancialReceipt(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: financialReceiptKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: financialReceiptKeys.summaries(),
            })
            toast.success('Selected financial receipts deleted successfully')
        },
        onError: (error) => {
            toast.error(
                `Failed to delete selected financial receipts: ${error.message || 'Unknown error'}`
            )
        },
    })
}
