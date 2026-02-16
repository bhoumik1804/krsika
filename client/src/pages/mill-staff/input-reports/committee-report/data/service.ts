import { apiClient } from '@/lib/api-client'
import type { CommitteeReportData } from './schema'

interface FetchCommitteeListParams {
    millId: string
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

interface ApiResponse<T> {
    data: T
}

export interface CommitteeListResponse {
    committees: CommitteeReportData[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasPrevPage: boolean
        hasNextPage: boolean
        prevPage: number | null
        nextPage: number | null
    }
}

export const committeeService = {
    fetchCommitteeList: async (
        params: FetchCommitteeListParams
    ): Promise<CommitteeListResponse> => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.limit) queryParams.append('limit', params.limit.toString())
        if (params.search) queryParams.append('search', params.search)
        if (params.sortBy) queryParams.append('sortBy', params.sortBy)
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)

        const response = await apiClient.get<
            ApiResponse<CommitteeListResponse>
        >(`/mills/${params.millId}/committees?${queryParams.toString()}`)
        return response.data.data
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
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/committees/bulk`, {
            data: { ids: committeeIds },
        })
        return response.data.data
    },
}
