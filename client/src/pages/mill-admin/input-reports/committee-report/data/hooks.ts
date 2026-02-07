import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { CommitteeReportData } from './schema'
import { committeeService, type CommitteeListResponse } from './service'

// Query key factory for committees
const committeeQueryKeys = {
    all: ['committees'] as const,
    byMill: (millId: string) => [...committeeQueryKeys.all, millId] as const,
    list: (millId: string, filters?: Record<string, unknown>) =>
        [...committeeQueryKeys.byMill(millId), 'list', filters] as const,
}

interface UseCommitteeListParams {
    millId: string
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export const useCommitteeList = (params: UseCommitteeListParams) => {
    return useQuery<CommitteeListResponse, Error>({
        queryKey: committeeQueryKeys.list(params.millId, {
            page: params.page,
            limit: params.limit,
            search: params.search,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
        }),
        queryFn: () => committeeService.fetchCommitteeList(params),
        enabled: !!params.millId,
    })
}

export const useCreateCommittee = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Omit<CommitteeReportData, '_id'>) =>
            committeeService.createCommittee(millId, data),
        onSuccess: () => {
            toast.success('Committee created successfully')
            queryClient.invalidateQueries({
                queryKey: committeeQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to create committee'
            toast.error(errorMessage)
        },
    })
}

export const useBulkCreateCommittees = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Omit<CommitteeReportData, '_id'>[]) =>
            committeeService.bulkCreateCommittees(millId, data),
        onSuccess: (data) => {
            toast.success(`${data.count} committees created successfully`)
            queryClient.invalidateQueries({
                queryKey: committeeQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to create committees'
            toast.error(errorMessage)
        },
    })
}

export const useUpdateCommittee = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            committeeId,
            data,
        }: {
            committeeId: string
            data: Omit<CommitteeReportData, '_id'>
        }) => committeeService.updateCommittee(millId, committeeId, data),
        onSuccess: () => {
            toast.success('Committee updated successfully')
            queryClient.invalidateQueries({
                queryKey: committeeQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to update committee'
            toast.error(errorMessage)
        },
    })
}

export const useDeleteCommittee = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (committeeId: string) =>
            committeeService.deleteCommittee(millId, committeeId),
        onSuccess: () => {
            toast.success('Committee deleted successfully')
            queryClient.invalidateQueries({
                queryKey: committeeQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete committee'
            toast.error(errorMessage)
        },
    })
}

export const useBulkDeleteCommittees = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (committeeIds: string[]) =>
            committeeService.bulkDeleteCommittees(millId, committeeIds),
        onSuccess: () => {
            toast.success('Committees deleted successfully')
            queryClient.invalidateQueries({
                queryKey: committeeQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete committees'
            toast.error(errorMessage)
        },
    })
}
