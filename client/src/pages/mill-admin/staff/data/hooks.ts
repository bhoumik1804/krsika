/**
 * Staff Hooks
 * React Query hooks for Staff data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchStaffList,
    fetchStaffById,
    fetchStaffSummary,
    createStaff,
    updateStaff,
    deleteStaff,
    bulkDeleteStaff,
} from './service'
import type {
    StaffResponse,
    StaffListResponse,
    StaffSummaryResponse,
    CreateStaffRequest,
    UpdateStaffRequest,
    StaffQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const staffKeys = {
    all: ['staff'] as const,
    lists: () => [...staffKeys.all, 'list'] as const,
    list: (millId: string, params?: StaffQueryParams) =>
        [...staffKeys.lists(), millId, params] as const,
    details: () => [...staffKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...staffKeys.details(), millId, id] as const,
    summaries: () => [...staffKeys.all, 'summary'] as const,
    summary: (millId: string) => [...staffKeys.summaries(), millId] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch staff list with pagination and filters
 */
export const useStaffList = (
    millId: string,
    params?: StaffQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<StaffListResponse, Error>({
        queryKey: staffKeys.list(millId, params),
        queryFn: () => fetchStaffList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single staff member
 */
export const useStaffDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<StaffResponse, Error>({
        queryKey: staffKeys.detail(millId, id),
        queryFn: () => fetchStaffById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch staff summary/statistics
 */
export const useStaffSummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<StaffSummaryResponse, Error>({
        queryKey: staffKeys.summary(millId),
        queryFn: () => fetchStaffSummary(millId),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new staff member
 */
export const useCreateStaff = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<StaffResponse, Error, CreateStaffRequest>({
        mutationFn: (data) => createStaff(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: staffKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: staffKeys.summaries(),
            })
            toast.success('Staff member created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create staff member')
        },
    })
}

/**
 * Hook to update an existing staff member
 */
export const useUpdateStaff = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<StaffResponse, Error, UpdateStaffRequest>({
        mutationFn: (data) => updateStaff(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: staffKeys.lists(),
            })
            queryClient.setQueryData(staffKeys.detail(millId, data._id), data)
            queryClient.invalidateQueries({
                queryKey: staffKeys.summaries(),
            })
            toast.success('Staff member updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update staff member')
        },
    })
}

/**
 * Hook to delete a staff member
 */
export const useDeleteStaff = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteStaff(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: staffKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: staffKeys.summaries(),
            })
            toast.success('Staff member deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete staff member')
        },
    })
}

/**
 * Hook to bulk delete staff members
 */
export const useBulkDeleteStaff = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<{ deletedCount: number }, Error, string[]>({
        mutationFn: (ids) => bulkDeleteStaff(millId, ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: staffKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: staffKeys.summaries(),
            })
            toast.success(
                `${data.deletedCount} staff members deleted successfully`
            )
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete staff members')
        },
    })
}
