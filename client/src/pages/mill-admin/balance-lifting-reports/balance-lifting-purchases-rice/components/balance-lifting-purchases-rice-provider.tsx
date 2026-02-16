import React, { useEffect, useMemo, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useRicePurchaseList } from '@/pages/mill-admin/purchase-reports/rice/data/hooks'
import type { BalanceLiftingPurchasesRice } from '../data/schema'
import type { RicePurchaseResponse } from '@/pages/mill-admin/purchase-reports/rice/data/types'

type RiceDialogType = 'add' | 'edit' | 'delete'

interface QueryParams {
    page: number
    limit: number
    search?: string
}

type BalanceLiftingPurchasesRiceContextType = {
    open: RiceDialogType | null
    setOpen: (str: RiceDialogType | null) => void
    currentRow: BalanceLiftingPurchasesRice | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<BalanceLiftingPurchasesRice | null>
    >
    data: BalanceLiftingPurchasesRice[]
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

const BalanceLiftingPurchasesRiceContext =
    React.createContext<BalanceLiftingPurchasesRiceContextType | null>(null)

interface BalanceLiftingPurchasesRiceProviderProps {
    children: React.ReactNode
    millId: string
    initialQueryParams?: QueryParams
}

const defaultQueryParams: QueryParams = {
    page: 1,
    limit: 10,
    search: undefined,
}

function toBalanceLiftingRice(p: RicePurchaseResponse): BalanceLiftingPurchasesRice {
    return {
        _id: p._id,
        date: typeof p.date === 'string' ? p.date.split('T')[0] : p.date,
        partyName: p.partyName ?? null,
        brokerName: p.brokerName ?? null,
        deliveryType: p.deliveryType ?? null,
        lotOrOther: p.lotOrOther ?? null,
        fciOrNAN: p.fciOrNAN ?? null,
        riceType: p.riceType ?? null,
        riceQty: p.riceQty,
        riceRate: p.riceRate,
        discountPercent: p.discountPercent,
        brokeragePerQuintal: p.brokeragePerQuintal,
        gunnyType: p.gunnyType ?? null,
        newGunnyRate: p.newGunnyRate,
        oldGunnyRate: p.oldGunnyRate,
        plasticGunnyRate: p.plasticGunnyRate,
        frkType: p.frkType ?? null,
        frkRatePerQuintal: p.frkRatePerQuintal,
        lotNumber: p.lotNumber ?? null,
    }
}

export function BalanceLiftingPurchasesRiceProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
}: BalanceLiftingPurchasesRiceProviderProps) {
    const [open, setOpen] = useDialogState<RiceDialogType>(null)
    const [currentRow, setCurrentRow] =
        useState<BalanceLiftingPurchasesRice | null>(null)
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    useEffect(() => {
        setQueryParams(initialQueryParams)
    }, [initialQueryParams])

    const { data: apiResponse, isLoading, isError } = useRicePurchaseList({
        millId,
        page: queryParams.page,
        pageSize: queryParams.limit,
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
        () => (apiResponse?.data ?? []).map(toBalanceLiftingRice),
        [apiResponse?.data]
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
        <BalanceLiftingPurchasesRiceContext.Provider value={contextValue}>
            {children}
        </BalanceLiftingPurchasesRiceContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBalanceLiftingPurchasesRice = () => {
    const ctx = React.useContext(BalanceLiftingPurchasesRiceContext)
    if (!ctx) {
        throw new Error(
            'useBalanceLiftingPurchasesRice must be used within BalanceLiftingPurchasesRiceProvider'
        )
    }
    return ctx
}
