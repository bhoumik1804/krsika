/**
 * Labour Group Report Hooks
 * React Query hooks for Labour Group data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchLabourGroupList,
    fetchLabourGroupById,
    fetchLabourGroupSummary,
    createLabourGroup,
    updateLabourGroup,
    deleteLabourGroup,
    bulkDeleteLabourGroup,
    exportLabourGroup,
} from './service'
import type {
    LabourGroupResponse,
    LabourGroupListResponse,
    LabourGroupSummaryResponse,
    // CreateLabourGroupRequest,
    UpdateLabourGroupRequest,
    LabourGroupQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const labourGroupKeys = {
    all: ['labourGroup'] as const,
    lists: () => [...labourGroupKeys.all, 'list'] as const,
    list: (millId: string, params?: LabourGroupQueryParams) =>
        [...labourGroupKeys.lists(), millId, params] as const,
    details: () => [...labourGroupKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...labourGroupKeys.details(), millId, id] as const,
    summaries: () => [...labourGroupKeys.all, 'summary'] as const,
    summary: (millId: string) =>
        [...labourGroupKeys.summaries(), millId] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch labour group list with pagination and filters
 */
export const useLabourGroupList = (
    millId: string,
    params?: LabourGroupQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<LabourGroupListResponse, Error>({
        queryKey: labourGroupKeys.list(millId, params),
        queryFn: () => fetchLabourGroupList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single labour group
 */
export const useLabourGroupDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<LabourGroupResponse, Error>({
        queryKey: labourGroupKeys.detail(millId, id),
        queryFn: () => fetchLabourGroupById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch labour group summary/statistics
 */
export const useLabourGroupSummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<LabourGroupSummaryResponse, Error>({
        queryKey: labourGroupKeys.summary(millId),
        queryFn: () => fetchLabourGroupSummary(millId),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new labour group
 */
export const useCreateLabourGroup = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<any, Error, any>({
        mutationFn: (data) => createLabourGroup(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: labourGroupKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: labourGroupKeys.summaries(),
            })
            toast.success('Labour group created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create labour group')
        },
    })
}

/**
 * Hook to update an existing labour group
 */
export const useUpdateLabourGroup = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<LabourGroupResponse, Error, UpdateLabourGroupRequest>({
        mutationFn: (data) => updateLabourGroup(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: labourGroupKeys.lists(),
            })
            queryClient.setQueryData(
                labourGroupKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: labourGroupKeys.summaries(),
            })
            toast.success('Labour group updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update labour group')
        },
    })
}

/**
 * Hook to delete a labour group
 */
export const useDeleteLabourGroup = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteLabourGroup(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: labourGroupKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: labourGroupKeys.summaries(),
            })
            toast.success('Labour group deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete labour group')
        },
    })
}

/**
 * Hook to bulk delete labour groups
 */
export const useBulkDeleteLabourGroup = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteLabourGroup(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: labourGroupKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: labourGroupKeys.summaries(),
            })
            toast.success(`${ids.length} labour groups deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete labour groups')
        },
    })
}

/**
 * Hook to export labour groups
 */
export const useExportLabourGroup = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: LabourGroupQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportLabourGroup(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
