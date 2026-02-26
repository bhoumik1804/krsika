import { useState, useEffect, useCallback } from 'react'
import { DateRange } from 'react-day-picker'
import {
    StockByAction,
    getStockByAction,
    formatDateForApi,
    type GetStockByActionParams,
} from '@/lib/stock-transaction-api'

interface UseStockByActionOptions {
    millId: string
    action: string
    dateRange?: DateRange
}

interface UseStockByActionReturn {
    data: StockByAction[]
    loading: boolean
    error: string | null
    refetch: () => void
}

/**
 * Custom hook to fetch stock data grouped by commodity/variety for a specific action.
 * Automatically re-fetches when millId, action, or dateRange changes.
 */
export function useStockByAction({
    millId,
    action,
    dateRange,
}: UseStockByActionOptions): UseStockByActionReturn {
    const [data, setData] = useState<StockByAction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        if (!millId) return
        setLoading(true)
        setError(null)

        try {
            const params: GetStockByActionParams = {
                action,
                ...(dateRange?.from && {
                    startDate: formatDateForApi(dateRange.from),
                    endDate: dateRange.to
                        ? formatDateForApi(dateRange.to)
                        : formatDateForApi(dateRange.from),
                }),
            }

            const response = await getStockByAction(millId, params)
            setData(response.data.stocks || [])
        } catch (err: any) {
            const msg =
                err?.response?.data?.message || 'Failed to fetch stock data'
            setError(msg)
            setData([])
        } finally {
            setLoading(false)
        }
    }, [
        millId,
        action,
        dateRange?.from?.toISOString(),
        dateRange?.to?.toISOString(),
    ])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refetch: fetchData }
}
