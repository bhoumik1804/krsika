/**
 * DO Report Hooks
 * React Query hooks for DO Report data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchDoReportList,
    fetchDoReportById,
    fetchDoReportSummary,
    createDoReport,
    bulkCreateDoReport,
    updateDoReport,
    deleteDoReport,
    bulkDeleteDoReport,
    exportDoReport,
} from './service'
import type {
    DoReportResponse,
    DoReportListResponse,
    DoReportSummaryResponse,
    CreateDoReportRequest,
    UpdateDoReportRequest,
    DoReportQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const doReportKeys = {
    all: ['doReport'] as const,
    lists: () => [...doReportKeys.all, 'list'] as const,
    list: (millId: string, params?: DoReportQueryParams) =>
        [...doReportKeys.lists(), millId, params] as const,
    details: () => [...doReportKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...doReportKeys.details(), millId, id] as const,
    summaries: () => [...doReportKeys.all, 'summary'] as const,
    summary: (millId: string) => [...doReportKeys.summaries(), millId] as const,
}

// ==========================================
// Query Hooks
// ==========================================

interface UseDoReportListParams {
    millId: string
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

/**
 * Hook to fetch DO report list with pagination and filters
 */
export const useDoReportList = (params: UseDoReportListParams) => {
    return useQuery<DoReportListResponse, Error>({
        queryKey: doReportKeys.list(params.millId, {
            page: params.page,
            limit: params.limit,
            search: params.search,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
        }),
        queryFn: () => fetchDoReportList(params),
        enabled: !!params.millId,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook to fetch a single DO report
 */
export const useDoReportDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<DoReportResponse, Error>({
        queryKey: doReportKeys.detail(millId, id),
        queryFn: () => fetchDoReportById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook to fetch DO report summary/statistics
 */
export const useDoReportSummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<DoReportSummaryResponse, Error>({
        queryKey: doReportKeys.summary(millId),
        queryFn: () => fetchDoReportSummary(millId),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000,
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new DO report
 */
export const useCreateDoReport = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<DoReportResponse, Error, CreateDoReportRequest>({
        mutationFn: (data) => createDoReport(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: doReportKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: doReportKeys.summaries(),
            })
            toast.success('DO report created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create DO report')
        },
    })
}

/**
 * Hook to bulk create DO reports
 */
export const useBulkCreateDoReport = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        { reports: DoReportResponse[]; count: number },
        Error,
        CreateDoReportRequest[]
    >({
        mutationFn: (data) => bulkCreateDoReport(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: doReportKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: doReportKeys.summaries(),
            })
            toast.success(`${data.count} DO reports created successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create DO reports')
        },
    })
}

/**
 * Hook to update an existing DO report
 */
export const useUpdateDoReport = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<DoReportResponse, Error, UpdateDoReportRequest>({
        mutationFn: (data) => updateDoReport(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: doReportKeys.lists(),
            })
            queryClient.setQueryData(
                doReportKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: doReportKeys.summaries(),
            })
            toast.success('DO report updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update DO report')
        },
    })
}

/**
 * Hook to delete a DO report
 */
export const useDeleteDoReport = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteDoReport(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: doReportKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: doReportKeys.summaries(),
            })
            toast.success('DO report deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete DO report')
        },
    })
}

/**
 * Hook to bulk delete DO reports
 */
export const useBulkDeleteDoReport = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteDoReport(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: doReportKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: doReportKeys.summaries(),
            })
        },
    })
}

/**
 * Hook to export DO reports
 */
export const useExportDoReport = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: DoReportQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportDoReport(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
