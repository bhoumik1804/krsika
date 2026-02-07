import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { usePaddyPurchaseList } from '../data/hooks'
import { type PaddyPurchaseData } from '../data/schema'

type PaddyDialogType = 'add' | 'edit' | 'delete'

interface QueryParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

type PaddyContextType = {
    open: PaddyDialogType | null
    setOpen: (str: PaddyDialogType | null) => void
    currentRow: PaddyPurchaseData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<PaddyPurchaseData | null>>
    data: PaddyPurchaseData[]
    isLoading: boolean
    isError: boolean
    millId: string
    queryParams: QueryParams
    setQueryParams: React.Dispatch<React.SetStateAction<QueryParams>>
}

const PaddyContext = React.createContext<PaddyContextType | null>(null)

interface PaddyProviderProps {
    children: React.ReactNode
    millId: string
    initialQueryParams?: QueryParams
}

const defaultQueryParams: QueryParams = {
    page: 1,
    limit: 10,
    search: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
}

export function PaddyProvider({
    children,
    millId,
    initialQueryParams = defaultQueryParams,
}: PaddyProviderProps) {
    const [open, setOpen] = useDialogState<PaddyDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PaddyPurchaseData | null>(null)
    const [queryParams, setQueryParams] =
        useState<QueryParams>(initialQueryParams)

    const {
        data = [],
        isLoading,
        isError,
    } = usePaddyPurchaseList({
        millId,
        page: queryParams.page,
        pageSize: queryParams.limit,
        search: queryParams.search,
    })

    return (
        <PaddyContext
            value={{
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
            }}
        >
            {children}
        </PaddyContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePaddy = () => {
    const paddyContext = React.useContext(PaddyContext)

    if (!paddyContext) {
        throw new Error('usePaddy has to be used within <PaddyContext>')
    }

    return paddyContext
}
