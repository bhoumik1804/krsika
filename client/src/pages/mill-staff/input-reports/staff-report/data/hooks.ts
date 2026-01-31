/**
 * Staff Report Hooks
 * React Query hooks for Staff Report data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchStaffReportList,
    fetchStaffReportById,
    fetchStaffReportSummary,
    createStaffReport,
    updateStaffReport,
    deleteStaffReport,
    bulkDeleteStaffReport,
    exportStaffReport,
} from './service'
import type {
    StaffReportResponse,
    StaffReportListResponse,
    StaffReportSummaryResponse,
    CreateStaffReportRequest,
    UpdateStaffReportRequest,
    StaffReportQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const staffReportKeys = {
    all: ['staffReport'] as const,
    lists: () => [...staffReportKeys.all, 'list'] as const,
    list: (millId: string, params?: StaffReportQueryParams) =>
        [...staffReportKeys.lists(), millId, params] as const,
    details: () => [...staffReportKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...staffReportKeys.details(), millId, id] as const,
    summaries: () => [...staffReportKeys.all, 'summary'] as const,
    summary: (millId: string) =>
        [...staffReportKeys.summaries(), millId] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch staff report list with pagination and filters
 */
export const useStaffReportList = (
    millId: string,
    params?: StaffReportQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<StaffReportListResponse, Error>({
        queryKey: staffReportKeys.list(millId, params),
        queryFn: () => fetchStaffReportList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single staff report
 */
export const useStaffReportDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<StaffReportResponse, Error>({
        queryKey: staffReportKeys.detail(millId, id),
        queryFn: () => fetchStaffReportById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch staff report summary/statistics
 */
export const useStaffReportSummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<StaffReportSummaryResponse, Error>({
        queryKey: staffReportKeys.summary(millId),
        queryFn: () => fetchStaffReportSummary(millId),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new staff report
 */
export const useCreateStaffReport = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<StaffReportResponse, Error, CreateStaffReportRequest>({
        mutationFn: (data) => createStaffReport(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: staffReportKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: staffReportKeys.summaries(),
            })
            toast.success('Staff report created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create staff report')
        },
    })
}

/**
 * Hook to update an existing staff report
 */
export const useUpdateStaffReport = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<StaffReportResponse, Error, UpdateStaffReportRequest>({
        mutationFn: (data) => updateStaffReport(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: staffReportKeys.lists(),
            })
            queryClient.setQueryData(
                staffReportKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: staffReportKeys.summaries(),
            })
            toast.success('Staff report updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update staff report')
        },
    })
}

/**
 * Hook to delete a staff report
 */
export const useDeleteStaffReport = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteStaffReport(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: staffReportKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: staffReportKeys.summaries(),
            })
            toast.success('Staff report deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete staff report')
        },
    })
}

/**
 * Hook to bulk delete staff reports
 */
export const useBulkDeleteStaffReport = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteStaffReport(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: staffReportKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: staffReportKeys.summaries(),
            })
            toast.success(`${ids.length} staff reports deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete staff reports')
        },
    })
}

/**
 * Hook to export staff reports
 */
export const useExportStaffReport = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: StaffReportQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportStaffReport(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
