import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchStaffList,
    fetchStaffById,
    createStaff,
    updateStaff,
    deleteStaff,
    bulkDeleteStaff,
} from './service'
import {
    type CreateStaffRequest,
    type UpdateStaffRequest,
    type StaffQueryParams,
} from './types'

// Query Keys
export const staffKeys = {
    all: ['staff'] as const,
    lists: () => [...staffKeys.all, 'list'] as const,
    list: (millId: string, params: StaffQueryParams) =>
        [...staffKeys.lists(), millId, params] as const,
    details: () => [...staffKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...staffKeys.details(), millId, id] as const,
}

// Query Hooks
export const useStaffList = (
    millId: string,
    params?: StaffQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: staffKeys.list(millId, params || {}),
        queryFn: () => fetchStaffList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000,
    })
}

export const useStaffById = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: staffKeys.detail(millId, id),
        queryFn: () => fetchStaffById(millId, id),
        ...options,
    })
}

// Mutation Hooks
export const useCreateStaff = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateStaffRequest) => createStaff(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: staffKeys.lists() })
            toast.success('Staff created successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to create staff'
            )
        },
    })
}

export const useUpdateStaff = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateStaffRequest) => updateStaff(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: staffKeys.lists() })
            queryClient.invalidateQueries({ queryKey: staffKeys.details() })
            toast.success('Staff updated successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to update staff'
            )
        },
    })
}

export const useDeleteStaff = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteStaff(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: staffKeys.lists() })
            toast.success('Staff deleted successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to delete staff'
            )
        },
    })
}

export const useBulkDeleteStaff = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => bulkDeleteStaff(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: staffKeys.lists() })
            toast.success('Staffs deleted successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to delete staffs'
            )
        },
    })
}
