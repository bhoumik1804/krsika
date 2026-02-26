import { useState, useEffect, useCallback } from 'react'
import { DateRange } from 'react-day-picker'
import {
    StockTransaction,
    getStockTransactions,
    formatDateForApi,
} from '@/lib/stock-transaction-api'

interface UseStockTransactionsOptions {
    millId: string
    action?: string
    dateRange?: DateRange
    limit?: number
}

interface UseStockTransactionsReturn {
    data: StockTransaction[]
    loading: boolean
    error: string | null
    refetch: () => void
}

/**
 * Fetch date-wise stock transaction history for a given action and date range.
 * Used for transaction history table and date-wise export.
 */
export function useStockTransactions({
    millId,
    action,
    dateRange,
    limit = 500,
}: UseStockTransactionsOptions): UseStockTransactionsReturn {
    const [data, setData] = useState<StockTransaction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        if (!millId) return
        setLoading(true)
        setError(null)

        try {
            const params: Record<string, string | number | undefined> = {
                sortBy: 'date',
                sortOrder: 'desc',
                limit,
            }
            if (action) params.action = action
            if (dateRange?.from) {
                params.startDate = formatDateForApi(dateRange.from)
            }
            if (dateRange?.to) {
                params.endDate = formatDateForApi(dateRange.to)
            }
            // If only from is set, use from as endDate too for single-day query
            if (dateRange?.from && !dateRange?.to) {
                params.endDate = formatDateForApi(dateRange.from)
            }

            const response = await getStockTransactions(millId, params)
            const transactions = response?.data?.transactions ?? []
            setData(Array.isArray(transactions) ? transactions : [])
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message || 'Failed to fetch transactions'
            setError(msg)
            setData([])
        } finally {
            setLoading(false)
        }
    }, [
        millId,
        action,
        dateRange?.from?.toISOString?.(),
        dateRange?.to?.toISOString?.(),
        limit,
    ])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refetch: fetchData }
}
