import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { PartyReportData } from './schema'
import { partyService, type PartyListResponse } from './service'

// Query key factory for parties
const partyQueryKeys = {
    all: ['parties'] as const,
    byMill: (millId: string) => [...partyQueryKeys.all, millId] as const,
    list: (millId: string, filters?: Record<string, unknown>) =>
        [...partyQueryKeys.byMill(millId), 'list', filters] as const,
}

interface UsePartyListParams {
    millId: string
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export const usePartyList = (params: UsePartyListParams) => {
    return useQuery<PartyListResponse, Error>({
        queryKey: partyQueryKeys.list(params.millId, {
            page: params.page,
            limit: params.limit,
            search: params.search,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
        }),
        queryFn: () => partyService.fetchPartyList(params),
        enabled: !!params.millId,
    })
}

export const useCreateParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Partial<PartyReportData>) =>
            partyService.createParty(millId, data),
        onSuccess: () => {
            toast.success('Party created successfully')
            queryClient.invalidateQueries({
                queryKey: partyQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to create party'
            toast.error(errorMessage)
        },
    })
}

export const useUpdateParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            partyId,
            data,
        }: {
            partyId: string
            data: Partial<PartyReportData>
        }) => partyService.updateParty(millId, partyId, data),
        onSuccess: () => {
            toast.success('Party updated successfully')
            queryClient.invalidateQueries({
                queryKey: partyQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to update party'
            toast.error(errorMessage)
        },
    })
}

export const useDeleteParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (partyId: string) =>
            partyService.deleteParty(millId, partyId),
        onSuccess: () => {
            toast.success('Party deleted successfully')
            queryClient.invalidateQueries({
                queryKey: partyQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete party'
            toast.error(errorMessage)
        },
    })
}

export const useBulkDeleteParties = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (partyIds: string[]) =>
            partyService.bulkDeleteParties(millId, partyIds),
        onSuccess: () => {
            toast.success('Parties deleted successfully')
            queryClient.invalidateQueries({
                queryKey: partyQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete parties'
            toast.error(errorMessage)
        },
    })
}
