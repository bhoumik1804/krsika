/**
 * Mills Hooks
 * React Query hooks for Mills data management (Super Admin)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MILL_STATUS } from '@/constants'
import { toast } from 'sonner'
import {
    fetchMillsList,
    fetchMillById,
    fetchMillsSummary,
    createMill,
    updateMill,
    verifyMill,
    suspendMill,
    reactivateMill,
    deleteMill,
    bulkDeleteMills,
    // exportMills,
} from './service'
import type {
    MillResponse,
    MillListResponse,
    MillSummaryResponse,
    CreateMillRequest,
    UpdateMillRequest,
    VerifyMillRequest,
    MillQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const millsKeys = {
    all: ['mills'] as const,
    lists: () => [...millsKeys.all, 'list'] as const,
    list: (params?: MillQueryParams) => [...millsKeys.lists(), params] as const,
    details: () => [...millsKeys.all, 'detail'] as const,
    detail: (id: string) => [...millsKeys.details(), id] as const,
    summaries: () => [...millsKeys.all, 'summary'] as const,
    summary: () => [...millsKeys.summaries()] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch mills list with pagination and filters
 */
export const useMillsList = (
    params?: MillQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<MillListResponse, Error>({
        queryKey: millsKeys.list(params),
        queryFn: () => fetchMillsList(params),
        enabled: options?.enabled ?? true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single mill
 */
export const useMillDetail = (id: string, options?: { enabled?: boolean }) => {
    return useQuery<MillResponse, Error>({
        queryKey: millsKeys.detail(id),
        queryFn: () => fetchMillById(id),
        enabled: options?.enabled ?? !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch mills summary/statistics
 */
export const useMillsSummary = (options?: { enabled?: boolean }) => {
    return useQuery<MillSummaryResponse, Error>({
        queryKey: millsKeys.summary(),
        queryFn: () => fetchMillsSummary(),
        enabled: options?.enabled ?? true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new mill
 */
export const useCreateMill = () => {
    const queryClient = useQueryClient()

    return useMutation<MillResponse, Error, CreateMillRequest>({
        mutationFn: (data) => createMill(data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: millsKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: millsKeys.summaries(),
            })
            toast.success('Mill created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create mill')
        },
    })
}

/**
 * Hook to update an existing mill
 */
export const useUpdateMill = () => {
    const queryClient = useQueryClient()

    return useMutation<MillResponse, Error, UpdateMillRequest>({
        mutationFn: (data) => updateMill(data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: millsKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(millsKeys.detail(data._id), data)
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: millsKeys.summaries(),
            })
            toast.success('Mill updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update mill')
        },
    })
}

/**
 * Hook to verify a mill (approve/reject)
 */
export const useVerifyMill = () => {
    const queryClient = useQueryClient()

    return useMutation<any, Error, any>({
        mutationFn: (data) => verifyMill(data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: millsKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(millsKeys.detail(data._id), data)
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: millsKeys.summaries(),
            })
            alert(JSON.stringify(data))
            toast.success(
                data.mill.status === MILL_STATUS.ACTIVE
                    ? 'Mill approved successfully'
                    : 'Mill rejected'
            )
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to verify mill')
        },
    })
}

/**
 * Hook to suspend a mill
 */
export const useSuspendMill = () => {
    const queryClient = useQueryClient()

    return useMutation<MillResponse, Error, string>({
        mutationFn: (id) => suspendMill(id),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: millsKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(millsKeys.detail(data._id), data)
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: millsKeys.summaries(),
            })
            toast.success('Mill suspended successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to suspend mill')
        },
    })
}

/**
 * Hook to reactivate a suspended mill
 */
export const useReactivateMill = () => {
    const queryClient = useQueryClient()

    return useMutation<MillResponse, Error, string>({
        mutationFn: (id) => reactivateMill(id),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: millsKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(millsKeys.detail(data._id), data)
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: millsKeys.summaries(),
            })
            toast.success('Mill reactivated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to reactivate mill')
        },
    })
}

/**
 * Hook to delete a mill
 */
export const useDeleteMill = () => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteMill(id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: millsKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: millsKeys.summaries(),
            })
            toast.success('Mill deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete mill')
        },
    })
}

/**
 * Hook to bulk delete mills
 */
export const useBulkDeleteMills = () => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteMills(ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: millsKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: millsKeys.summaries(),
            })
            toast.success(`${ids.length} mills deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete mills')
        },
    })
}
