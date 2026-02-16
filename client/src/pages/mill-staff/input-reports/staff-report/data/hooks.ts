import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { StaffReportData } from './schema'
import { staffService, type StaffListResponse } from './service'

// Query key factory for staff
const staffQueryKeys = {
    all: ['staff'] as const,
    byMill: (millId: string) => [...staffQueryKeys.all, millId] as const,
    list: (millId: string, filters?: Record<string, unknown>) =>
        [...staffQueryKeys.byMill(millId), 'list', filters] as const,
}

interface UseStaffListParams {
    millId: string
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export const useStaffList = (params: UseStaffListParams) => {
    return useQuery<StaffListResponse, Error>({
        queryKey: staffQueryKeys.list(params.millId, {
            page: params.page,
            limit: params.limit,
            search: params.search,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
        }),
        queryFn: () => staffService.fetchStaffList(params),
        enabled: !!params.millId,
    })
}

export const useCreateStaff = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Partial<StaffReportData>) =>
            staffService.createStaff(millId, data),
        onSuccess: () => {
            toast.success('Staff created successfully')
            queryClient.invalidateQueries({
                queryKey: staffQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to create staff'
            toast.error(errorMessage)
        },
    })
}

export const useUpdateStaff = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            staffId,
            data,
        }: {
            staffId: string
            data: Partial<StaffReportData>
        }) => staffService.updateStaff(millId, staffId, data),
        onSuccess: () => {
            toast.success('Staff updated successfully')
            queryClient.invalidateQueries({
                queryKey: staffQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to update staff'
            toast.error(errorMessage)
        },
    })
}

export const useDeleteStaff = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (staffId: string) =>
            staffService.deleteStaff(millId, staffId),
        onSuccess: () => {
            toast.success('Staff deleted successfully')
            queryClient.invalidateQueries({
                queryKey: staffQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete staff'
            toast.error(errorMessage)
        },
    })
}

export const useBulkDeleteStaff = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (staffIds: string[]) =>
            staffService.bulkDeleteStaff(millId, staffIds),
        onSuccess: () => {
            toast.success('Staff members deleted successfully')
            queryClient.invalidateQueries({
                queryKey: staffQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete staff members'
            toast.error(errorMessage)
        },
    })
}
