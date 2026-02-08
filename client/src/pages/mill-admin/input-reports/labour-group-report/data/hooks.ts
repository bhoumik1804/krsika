import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchLabourGroupList,
    fetchLabourGroupById,
    fetchLabourGroupSummary,
    createLabourGroup,
    updateLabourGroup,
    deleteLabourGroup,
    bulkDeleteLabourGroup,
} from './service'
import type {
    CreateLabourGroupRequest,
    UpdateLabourGroupRequest,
    LabourGroupQueryParams,
} from './types'

// Query Keys
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

// Query Hooks
export const useLabourGroupList = (
    millId: string,
    params?: LabourGroupQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: labourGroupKeys.list(millId, params || {}),
        queryFn: () => fetchLabourGroupList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000,
    })
}

export const useLabourGroupById = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: labourGroupKeys.detail(millId, id),
        queryFn: () => fetchLabourGroupById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000,
    })
}

export const useLabourGroupSummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: labourGroupKeys.summary(millId),
        queryFn: () => fetchLabourGroupSummary(millId),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000,
    })
}

// Mutation Hooks
export const useCreateLabourGroup = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateLabourGroupRequest) =>
            createLabourGroup(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: labourGroupKeys.lists() })
            queryClient.invalidateQueries({
                queryKey: labourGroupKeys.summaries(),
            })
            toast.success('Labour group created successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                    'Failed to create labour group'
            )
        },
    })
}

export const useUpdateLabourGroup = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateLabourGroupRequest) =>
            updateLabourGroup(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: labourGroupKeys.lists() })
            queryClient.invalidateQueries({
                queryKey: labourGroupKeys.details(),
            })
            queryClient.invalidateQueries({
                queryKey: labourGroupKeys.summaries(),
            })
            toast.success('Labour group updated successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                    'Failed to update labour group'
            )
        },
    })
}

export const useDeleteLabourGroup = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteLabourGroup(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: labourGroupKeys.lists() })
            queryClient.invalidateQueries({
                queryKey: labourGroupKeys.summaries(),
            })
            toast.success('Labour group deleted successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                    'Failed to delete labour group'
            )
        },
    })
}

export const useBulkDeleteLabourGroup = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => bulkDeleteLabourGroup(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: labourGroupKeys.lists() })
            queryClient.invalidateQueries({
                queryKey: labourGroupKeys.summaries(),
            })
            toast.success('Labour groups deleted successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                    'Failed to delete labour groups'
            )
        },
    })
}
