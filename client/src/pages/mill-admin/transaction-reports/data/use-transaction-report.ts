import { useState, useEffect, useCallback } from 'react'
import { format, startOfMonth, endOfDay } from 'date-fns'
import {
    getPartyTransactionReport,
    getBrokerTransactionReport,
} from './transaction-report-api'
import type { PartyTransaction } from '../party/data/schema'
import type { BrokerTransaction } from '../broker/data/schema'

const formatDateForApi = (d: Date) => format(d, 'yyyy-MM-dd')

export function usePartyTransactionReport(millId: string, search: Record<string, unknown>) {
    const [data, setData] = useState<PartyTransaction[]>([])
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        if (!millId) return
        setLoading(true)
        setError(null)
        try {
            const page = Number(search?.page) || 1
            const limit = Number(search?.pageSize) || 10
            const partyName = (search?.partyName as string) || undefined
            const startDate =
                (search?.startDate as string) ||
                format(startOfMonth(new Date()), 'yyyy-MM-dd')
            const endDate =
                (search?.endDate as string) ||
                format(endOfDay(new Date()), 'yyyy-MM-dd')

            const res = await getPartyTransactionReport(millId, {
                page,
                limit,
                partyName,
                startDate,
                endDate,
            })
            const payload = res?.data
            setData(payload?.data ?? [])
            setPagination(payload?.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 })
        } catch (err: unknown) {
            setError((err as { message?: string })?.message ?? 'Failed to fetch report')
            setData([])
        } finally {
            setLoading(false)
        }
    }, [millId, search?.page, search?.pageSize, search?.partyName, search?.startDate, search?.endDate])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, pagination, loading, error, refetch: fetchData }
}

export function useBrokerTransactionReport(millId: string, search: Record<string, unknown>) {
    const [data, setData] = useState<BrokerTransaction[]>([])
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        if (!millId) return
        setLoading(true)
        setError(null)
        try {
            const page = Number(search?.page) || 1
            const limit = Number(search?.pageSize) || 10
            const brokerName = (search?.brokerName as string) || undefined
            const startDate =
                (search?.startDate as string) ||
                format(startOfMonth(new Date()), 'yyyy-MM-dd')
            const endDate =
                (search?.endDate as string) ||
                format(endOfDay(new Date()), 'yyyy-MM-dd')

            const res = await getBrokerTransactionReport(millId, {
                page,
                limit,
                brokerName,
                startDate,
                endDate,
            })
            const payload = res?.data
            setData(payload?.data ?? [])
            setPagination(payload?.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 })
        } catch (err: unknown) {
            setError((err as { message?: string })?.message ?? 'Failed to fetch report')
            setData([])
        } finally {
            setLoading(false)
        }
    }, [millId, search?.page, search?.pageSize, search?.brokerName, search?.startDate, search?.endDate])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, pagination, loading, error, refetch: fetchData }
}

export { formatDateForApi }
