import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { BrokerReportData } from './schema'
import { brokerService, type BrokerListResponse } from './service'

// Re-export types
export type { BrokerListResponse }

// Query key factory for brokers
const brokerQueryKeys = {
    all: ['brokers'] as const,
    byMill: (millId: string) => [...brokerQueryKeys.all, millId] as const,
    list: (millId: string, filters?: Record<string, unknown>) =>
        [...brokerQueryKeys.byMill(millId), 'list', filters] as const,
}

export interface UseBrokerListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
}

export const useBrokerList = (params: UseBrokerListParams) => {
    return useQuery<BrokerListResponse, Error>({
        queryKey: brokerQueryKeys.list(params.millId, {
            page: params.page,
            pageSize: params.pageSize,
            search: params.search,
        }),
        queryFn: () => brokerService.fetchBrokerList(params),
        enabled: !!params.millId,
    })
}

export const useCreateBroker = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Omit<BrokerReportData, 'id'>) =>
            brokerService.createBroker(millId, data),
        onSuccess: () => {
            toast.success('Broker created successfully')
            queryClient.invalidateQueries({
                queryKey: brokerQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to create broker'
            toast.error(errorMessage)
        },
    })
}

export const useUpdateBroker = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            brokerId,
            data,
        }: {
            brokerId: string
            data: Omit<BrokerReportData, 'id'>
        }) => brokerService.updateBroker(millId, brokerId, data),
        onSuccess: () => {
            toast.success('Broker updated successfully')
            queryClient.invalidateQueries({
                queryKey: brokerQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to update broker'
            toast.error(errorMessage)
        },
    })
}

export const useDeleteBroker = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (brokerId: string) =>
            brokerService.deleteBroker(millId, brokerId),
        onSuccess: () => {
            toast.success('Broker deleted successfully')
            queryClient.invalidateQueries({
                queryKey: brokerQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete broker'
            toast.error(errorMessage)
        },
    })
}

export const useBulkDeleteBrokers = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (brokerIds: string[]) =>
            brokerService.bulkDeleteBrokers(millId, brokerIds),
        onSuccess: () => {
            toast.success('Brokers deleted successfully')
            queryClient.invalidateQueries({
                queryKey: brokerQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete brokers'
            toast.error(errorMessage)
        },
    })
}
