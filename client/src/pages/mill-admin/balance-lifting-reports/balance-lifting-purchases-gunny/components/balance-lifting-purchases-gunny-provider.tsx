import React, { useEffect, useMemo, useState } from 'react'
import { useGunnyPurchaseList } from '@/pages/mill-admin/purchase-reports/gunny/data/hooks'
import type { GunnyPurchaseResponse } from '@/pages/mill-admin/purchase-reports/gunny/data/types'
import useDialogState from '@/hooks/use-dialog-state'
import type { BalanceLiftingPurchasesGunny } from '../data/schema'

type GunnyDialogType = 'add' | 'edit' | 'delete' | 'view'

interface QueryParams {
    page: number
    limit: number
    search?: string
}

type BalanceLiftingPurchasesGunnyContextType = {
    open: GunnyDialogType | null
    setOpen: (str: GunnyDialogType | null) => void
    currentRow: BalanceLiftingPurchasesGunny | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<BalanceLiftingPurchasesGunny | null>
    >
    data: BalanceLiftingPurchasesGunny[]
    isLoading: boolean
    isError: boolean
    millId: string
    queryParams: QueryParams
    setQueryParams: React.Dispatch<React.SetStateAction<QueryParams>>
    pagination: {
        page: number
        pageSize: number
        total: number
        totalPages: number
    }
}

const BalanceLiftingPurchasesGunnyContext =
    React.createContext<BalanceLiftingPurchasesGunnyContextType | null>(null)

interface BalanceLiftingPurchasesGunnyProviderProps {
    children: React.ReactNode
    millId: string
    initialQueryParams?: QueryParams
}

const defaultQueryParams: QueryParams = {
    page: 1,
    limit: 10,
    search: undefined,
}

function toBalanceLiftingGunny(
    p: GunnyPurchaseResponse
): BalanceLiftingPurchasesGunny {
    return {
        _id: p._id,
        gunnyPurchaseDealNumber: p.gunnyPurchaseDealNumber ?? null,
        date: typeof p.date === 'string' ? p.date.split('T')[0] : p.date,
        partyName: p.partyName ?? null,
        deliveryType: p.deliveryType ?? null,
        newGunnyQty: p.newGunnyQty,
        newGunnyRate: p.newGunnyRate,
        oldGunnyQty: p.oldGunnyQty,
        oldGunnyRate: p.oldGunnyRate,
        plasticGunnyQty: p.plasticGunnyQty,
        plasticGunnyRate: p.plasticGunnyRate,
    }
}

export function BalanceLiftingPurchasesGunnyProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
}: BalanceLiftingPurchasesGunnyProviderProps) {
    const [open, setOpen] = useDialogState<GunnyDialogType>(null)
    const [currentRow, setCurrentRow] =
        useState<BalanceLiftingPurchasesGunny | null>(null)
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    useEffect(() => {
        setQueryParams(initialQueryParams)
    }, [initialQueryParams])

    const {
        data: apiResponse,
        isLoading,
        isError,
    } = useGunnyPurchaseList({
        millId,
        page: queryParams.page,
        limit: queryParams.limit,
        search: queryParams.search,
    })

    const pagination = useMemo(
        () => ({
            page: apiResponse?.pagination?.page || 1,
            pageSize: apiResponse?.pagination?.limit || 10,
            total: apiResponse?.pagination?.total || 0,
            totalPages: apiResponse?.pagination?.totalPages || 0,
        }),
        [
            apiResponse?.pagination?.page,
            apiResponse?.pagination?.limit,
            apiResponse?.pagination?.total,
            apiResponse?.pagination?.totalPages,
        ]
    )

    const data = useMemo(
        () => (apiResponse?.purchases ?? []).map(toBalanceLiftingGunny),
        [apiResponse?.purchases]
    )

    const contextValue = useMemo(
        () => ({
            open,
            setOpen,
            currentRow,
            setCurrentRow,
            data,
            isLoading,
            isError,
            millId,
            queryParams,
            setQueryParams,
            pagination,
        }),
        [
            open,
            currentRow,
            data,
            isLoading,
            isError,
            millId,
            queryParams.page,
            queryParams.limit,
            queryParams.search,
            pagination,
        ]
    )

    return (
        <BalanceLiftingPurchasesGunnyContext.Provider value={contextValue}>
            {children}
        </BalanceLiftingPurchasesGunnyContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBalanceLiftingPurchasesGunny = () => {
    const ctx = React.useContext(BalanceLiftingPurchasesGunnyContext)
    if (!ctx) {
        throw new Error(
            'useBalanceLiftingPurchasesGunny must be used within BalanceLiftingPurchasesGunnyProvider'
        )
    }
    return ctx
}
