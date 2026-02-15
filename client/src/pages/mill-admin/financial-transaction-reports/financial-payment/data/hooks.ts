import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationResult,
    type UseQueryResult,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    bulkDeleteFinancialPayment,
    createFinancialPayment,
    deleteFinancialPayment,
    fetchFinancialPaymentById,
    fetchFinancialPaymentList,
    fetchFinancialPaymentSummary,
    updateFinancialPayment,
} from './service'
import type {
    CreateFinancialPaymentRequest,
    FinancialPaymentListResponse,
    FinancialPaymentQueryParams,
    FinancialPaymentResponse,
    FinancialPaymentSummaryResponse,
    UpdateFinancialPaymentRequest,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const financialPaymentKeys = {
    all: ['financial-payment'] as const,
    lists: () => [...financialPaymentKeys.all, 'list'] as const,
    list: (millId: string, params?: FinancialPaymentQueryParams) =>
        [...financialPaymentKeys.lists(), millId, params] as const,
    details: () => [...financialPaymentKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...financialPaymentKeys.details(), millId, id] as const,
    summaries: () => [...financialPaymentKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<FinancialPaymentQueryParams, 'startDate' | 'endDate'>
    ) => [...financialPaymentKeys.summaries(), millId, params] as const,
}

// ==========================================
// Hooks
// ==========================================

/**
 * Hook to fetch financial payment list
 */
export const useFinancialPaymentList = (
    millId: string,
    params?: FinancialPaymentQueryParams
): UseQueryResult<FinancialPaymentListResponse, Error> => {
    return useQuery({
        queryKey: financialPaymentKeys.list(millId, params),
        queryFn: () => fetchFinancialPaymentList(millId, params),
        enabled: !!millId,
    })
}

/**
 * Hook to fetch a single financial payment by ID
 */
export const useFinancialPayment = (
    millId: string,
    id: string
): UseQueryResult<FinancialPaymentResponse, Error> => {
    return useQuery({
        queryKey: financialPaymentKeys.detail(millId, id),
        queryFn: () => fetchFinancialPaymentById(millId, id),
        enabled: !!millId && !!id,
    })
}

/**
 * Hook to fetch financial payment summary
 */
export const useFinancialPaymentSummary = (
    millId: string,
    params?: Pick<FinancialPaymentQueryParams, 'startDate' | 'endDate'>
): UseQueryResult<FinancialPaymentSummaryResponse, Error> => {
    return useQuery({
        queryKey: financialPaymentKeys.summary(millId, params),
        queryFn: () => fetchFinancialPaymentSummary(millId, params),
        enabled: !!millId,
    })
}

/**
 * Hook to create a new financial payment
 */
export const useCreateFinancialPayment = (): UseMutationResult<
    FinancialPaymentResponse,
    Error,
    { millId: string; data: CreateFinancialPaymentRequest }
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ millId, data }) => createFinancialPayment(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: financialPaymentKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: financialPaymentKeys.summaries(),
            })
            toast.success('Financial payment created successfully')
        },
        onError: (error) => {
            toast.error(
                `Failed to create financial payment: ${error.message || 'Unknown error'}`
            )
        },
    })
}

/**
 * Hook to update existing financial payment
 */
export const useUpdateFinancialPayment = (): UseMutationResult<
    FinancialPaymentResponse,
    Error,
    { millId: string; data: UpdateFinancialPaymentRequest }
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ millId, data }) => updateFinancialPayment(millId, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: financialPaymentKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: financialPaymentKeys.detail(
                    variables.millId,
                    data._id!
                ),
            })
            queryClient.invalidateQueries({
                queryKey: financialPaymentKeys.summaries(),
            })
            toast.success('Financial payment updated successfully')
        },
        onError: (error) => {
            toast.error(
                `Failed to update financial payment: ${error.message || 'Unknown error'}`
            )
        },
    })
}

/**
 * Hook to delete a financial payment
 */
export const useDeleteFinancialPayment = (): UseMutationResult<
    void,
    Error,
    { millId: string; id: string }
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ millId, id }) => deleteFinancialPayment(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: financialPaymentKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: financialPaymentKeys.summaries(),
            })
            toast.success('Financial payment deleted successfully')
        },
        onError: (error) => {
            toast.error(
                `Failed to delete financial payment: ${error.message || 'Unknown error'}`
            )
        },
    })
}

/**
 * Hook to bulk delete financial payment entries
 */
export const useBulkDeleteFinancialPayment = (): UseMutationResult<
    void,
    Error,
    { millId: string; ids: string[] }
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ millId, ids }) =>
            bulkDeleteFinancialPayment(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: financialPaymentKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: financialPaymentKeys.summaries(),
            })
            toast.success('Selected financial payments deleted successfully')
        },
        onError: (error) => {
            toast.error(
                `Failed to delete selected financial payments: ${error.message || 'Unknown error'}`
            )
        },
    })
}
