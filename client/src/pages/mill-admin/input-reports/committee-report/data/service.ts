import { apiClient } from '@/lib/api-client'
import type { CommitteeReportData } from './schema'

interface FetchCommitteeListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
}

interface ApiResponse<T> {
    data: T
}

export const committeeService = {
    fetchCommitteeList: async (params: FetchCommitteeListParams) => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.pageSize)
            queryParams.append('pageSize', params.pageSize.toString())
        if (params.search) queryParams.append('search', params.search)

        const response = await apiClient.get<
            ApiResponse<{
                committees: CommitteeReportData[]
                pagination: Record<string, unknown>
            }>
        >(`/mills/${params.millId}/committees?${queryParams.toString()}`)
        return response.data.data.committees
    },

    createCommittee: async (
        millId: string,
        data: Omit<CommitteeReportData, '_id'>
    ) => {
        const response = await apiClient.post<
            ApiResponse<{ committee: CommitteeReportData }>
        >(`/mills/${millId}/committees`, data)
        return response.data.data.committee
    },

    bulkCreateCommittees: async (
        millId: string,
        data: Omit<CommitteeReportData, '_id'>[]
    ) => {
        const response = await apiClient.post<
            ApiResponse<{ committees: CommitteeReportData[]; count: number }>
        >(`/mills/${millId}/committees/bulk`, data)
        return response.data.data
    },

    updateCommittee: async (
        millId: string,
        committeeId: string,
        data: Omit<CommitteeReportData, '_id'>
    ) => {
        const response = await apiClient.put<
            ApiResponse<{ committee: CommitteeReportData }>
        >(`/mills/${millId}/committees/${committeeId}`, data)
        return response.data.data.committee
    },

    deleteCommittee: async (millId: string, committeeId: string) => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/committees/${committeeId}`)
        return response.data.data
    },

    bulkDeleteCommittees: async (millId: string, committeeIds: string[]) => {
        const response = await apiClient.post<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/committees/bulk-delete`, { ids: committeeIds })
        return response.data.data
    },
}
