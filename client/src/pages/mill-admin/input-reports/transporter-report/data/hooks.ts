import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { TransporterReportData } from './schema'
import { transporterService, type TransporterListResponse } from './service'

// Query key factory for transporters
const transporterQueryKeys = {
    all: ['transporters'] as const,
    byMill: (millId: string) => [...transporterQueryKeys.all, millId] as const,
    list: (millId: string, filters?: Record<string, unknown>) =>
        [...transporterQueryKeys.byMill(millId), 'list', filters] as const,
}

interface UseTransporterListParams {
    millId: string
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export const useTransporterList = (params: UseTransporterListParams) => {
    return useQuery<TransporterListResponse, Error>({
        queryKey: transporterQueryKeys.list(params.millId, {
            page: params.page,
            limit: params.limit,
            search: params.search,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
        }),
        queryFn: () => transporterService.fetchTransporterList(params),
        enabled: !!params.millId,
    })
}

export const useCreateTransporter = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Partial<TransporterReportData>) =>
            transporterService.createTransporter(millId, data),
        onSuccess: () => {
            toast.success('Transporter created successfully')
            queryClient.invalidateQueries({
                queryKey: transporterQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to create transporter'
            toast.error(errorMessage)
        },
    })
}

export const useUpdateTransporter = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            transporterId,
            data,
        }: {
            transporterId: string
            data: Partial<TransporterReportData>
        }) => transporterService.updateTransporter(millId, transporterId, data),
        onSuccess: () => {
            toast.success('Transporter updated successfully')
            queryClient.invalidateQueries({
                queryKey: transporterQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to update transporter'
            toast.error(errorMessage)
        },
    })
}

export const useDeleteTransporter = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (transporterId: string) =>
            transporterService.deleteTransporter(millId, transporterId),
        onSuccess: () => {
            toast.success('Transporter deleted successfully')
            queryClient.invalidateQueries({
                queryKey: transporterQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete transporter'
            toast.error(errorMessage)
        },
    })
}

export const useBulkDeleteTransporters = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (transporterIds: string[]) =>
            transporterService.bulkDeleteTransporters(millId, transporterIds),
        onSuccess: () => {
            toast.success('Transporters deleted successfully')
            queryClient.invalidateQueries({
                queryKey: transporterQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete transporters'
            toast.error(errorMessage)
        },
    })
}
