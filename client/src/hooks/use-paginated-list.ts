import { useState, useEffect, useCallback, type UIEvent } from 'react'

// ==========================================
// Types
// ==========================================

interface ListHookParams {
    millId: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export interface PaginatedListConfig<TData> {
    /** Any list query hook (usePartyList, useBrokerList, etc.) */
    useListHook: (params: ListHookParams) => { data: TData | undefined }
    /** Extract string[] items from the response data */
    extractItems: (data: TData) => string[]
    /** Extra params forwarded to the hook */
    hookParams?: { sortBy?: string; sortOrder?: 'asc' | 'desc' }
}

export interface PaginatedListResult {
    items: string[]
    onScroll: (e: UIEvent<HTMLDivElement>) => void
    isLoadingMore: boolean
}

// ==========================================
// Hook
// ==========================================

/**
 * Generic paginated-selection hook for Combobox dropdowns.
 *
 * Handles pagination, scroll-to-load-more, item accumulation,
 * and initial-value seeding for edit dialogs.
 *
 * @example
 * const transporter = usePaginatedList(millId, open, {
 *     useListHook: useTransporterList,
 *     extractItems: (d) => d.transporters.map(t => t.transporterName),
 *     hookParams: { sortBy: 'transporterName', sortOrder: 'asc' },
 * }, currentRow?.transporterName)
 */
export function usePaginatedList<TData>(
    millId: string,
    open: boolean,
    config: PaginatedListConfig<TData>,
    initialValue?: string
): PaginatedListResult {
    const { useListHook, extractItems, hookParams } = config

    const [page, setPage] = useState(1)
    const [allItems, setAllItems] = useState<string[]>([])
    const [hasMore, setHasMore] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    const getLimit = () => 10

    // Fetch current page
    const { data } = useListHook({
        millId: open ? millId : '',
        page,
        limit: getLimit(),
        ...hookParams,
    })

    // Accumulate items from fetched data
    useEffect(() => {
        if (!open || !data) return

        const newItems = extractItems(data)

        if (page === 1) {
            setAllItems(
                Array.from(
                    new Set(
                        [initialValue, ...newItems].filter(Boolean) as string[]
                    )
                )
            )
        } else {
            setAllItems((prev) => Array.from(new Set([...prev, ...newItems])))
        }

        setHasMore(newItems.length === getLimit())
        setIsLoadingMore(false)
    }, [data, page, open, initialValue])

    // Reset / seed on open/close
    useEffect(() => {
        if (open) {
            setAllItems((prev) => {
                if (initialValue && !prev.includes(initialValue)) {
                    return [initialValue, ...prev]
                }
                return prev.length === 0 && initialValue ? [initialValue] : prev
            })
        } else {
            setPage(1)
            setHasMore(true)
            setIsLoadingMore(false)
        }
    }, [open, initialValue])

    // Infinite-scroll handler
    const handleScroll = useCallback(
        (e: UIEvent<HTMLDivElement>) => {
            const { scrollHeight, scrollTop, clientHeight } = e.currentTarget
            if (
                scrollHeight - scrollTop <= clientHeight + 5 &&
                hasMore &&
                !isLoadingMore
            ) {
                setIsLoadingMore(true)
                setPage((prev) => prev + 1)
            }
        },
        [hasMore, isLoadingMore]
    )

    return { items: allItems, onScroll: handleScroll, isLoadingMore }
}
