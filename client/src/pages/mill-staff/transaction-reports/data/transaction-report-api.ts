import { apiClient, type ApiResponse } from '@/lib/api-client'
import type { PartyTransaction } from '../party/data/schema'
import type { BrokerTransaction } from '../broker/data/schema'

const BASE = (millId: string) => `/mills/${millId}/transaction-reports`

export interface PartyReportParams {
    page?: number
    limit?: number
    partyName?: string
    startDate?: string
    endDate?: string
}

export interface BrokerReportParams {
    page?: number
    limit?: number
    brokerName?: string
    startDate?: string
    endDate?: string
}

export interface ReportPagination {
    page: number
    limit: number
    total: number
    totalPages: number
}

export interface PartyReportResponse {
    data: PartyTransaction[]
    pagination: ReportPagination
}

export interface BrokerReportResponse {
    data: BrokerTransaction[]
    pagination: ReportPagination
}

export async function getPartyTransactionReport(
    millId: string,
    params?: PartyReportParams
) {
    const res = await apiClient.get<ApiResponse<PartyReportResponse>>(
        `${BASE(millId)}/party`,
        { params }
    )
    return res.data
}

export async function getBrokerTransactionReport(
    millId: string,
    params?: BrokerReportParams
) {
    const res = await apiClient.get<ApiResponse<BrokerReportResponse>>(
        `${BASE(millId)}/broker`,
        { params }
    )
    return res.data
}
