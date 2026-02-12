import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { otherInwardService } from './service'
import type {
    OtherInwardQueryParams,
    CreateOtherInwardRequest,
    UpdateOtherInwardRequest,
} from './types'

// Query key factory for other inward
const otherInwardQueryKeys = {
    all: ['other-inward'] as const,
    byMill: (millId: string) => [...otherInwardQueryKeys.all, millId] as const,
    list: (millId: string, filters?: OtherInwardQueryParams) =>
        [...otherInwardQueryKeys.byMill(millId), 'list', filters] as const,
    summary: (
        millId: string,
        params?: { startDate?: string; endDate?: string }
    ) => [...otherInwardQueryKeys.byMill(millId), 'summary', params] as const,
}

interface UseOtherInwardListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
    sortBy?: OtherInwardQueryParams['sortBy']
    sortOrder?: 'asc' | 'desc'
}

export const useOtherInwardList = (params: UseOtherInwardListParams) => {
    const queryParams: OtherInwardQueryParams = {
        page: params.page,
        limit: params.pageSize,
        search: params.search,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
    }

    const query = useQuery({
        queryKey: otherInwardQueryKeys.list(params.millId, queryParams),
        queryFn: () =>
            otherInwardService.fetchOtherInwardList(params.millId, queryParams),
        enabled: !!params.millId,
    })

    return {
        data: query.data?.entries || [],
        pagination: query.data?.pagination || {
            page: params.page || 1,
            limit: params.pageSize || 10,
            total: 0,
            totalPages: 0,
            hasPrevPage: false,
            hasNextPage: false,
            prevPage: null,
            nextPage: null,
        },
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    }
}

export const useOtherInwardSummary = (
    millId: string,
    params?: { startDate?: string; endDate?: string }
) => {
    return useQuery({
        queryKey: otherInwardQueryKeys.summary(millId, params),
        queryFn: () =>
            otherInwardService.fetchOtherInwardSummary(millId, params),
        enabled: !!millId,
    })
}

export const useCreateOtherInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateOtherInwardRequest) =>
            otherInwardService.createOtherInward(millId, data),
        onSuccess: () => {
            toast.success('Other inward entry created successfully')
            queryClient.invalidateQueries({
                queryKey: otherInwardQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to create other inward entry'
            toast.error(errorMessage)
        },
    })
}

export const useUpdateOtherInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (params: {
            entryId: string
            data: UpdateOtherInwardRequest
        }) =>
            otherInwardService.updateOtherInward(
                millId,
                params.entryId,
                params.data
            ),
        onSuccess: () => {
            toast.success('Other inward entry updated successfully')
            queryClient.invalidateQueries({
                queryKey: otherInwardQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to update other inward entry'
            toast.error(errorMessage)
        },
    })
}

export const useDeleteOtherInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (entryId: string) =>
            otherInwardService.deleteOtherInward(millId, entryId),
        onSuccess: () => {
            toast.success('Other inward entry deleted successfully')
            queryClient.invalidateQueries({
                queryKey: otherInwardQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete other inward entry'
            toast.error(errorMessage)
        },
    })
}

export const useBulkDeleteOtherInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (entryIds: string[]) =>
            otherInwardService.bulkDeleteOtherInward(millId, entryIds),
        onSuccess: () => {
            toast.success('Other inward entries deleted successfully')
            queryClient.invalidateQueries({
                queryKey: otherInwardQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete other inward entries'
            toast.error(errorMessage)
        },
    })
}
