import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useGunnyInwardList } from '../data/hooks'
import { type GunnyInward, type GunnyInwardQueryParams } from '../data/types'

type GunnyInwardDialogType = 'add' | 'edit' | 'delete'

type GunnyInwardContextType = {
    millId: string
    open: GunnyInwardDialogType | null
    setOpen: (str: GunnyInwardDialogType | null) => void
    currentRow: GunnyInward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<GunnyInward | null>>
    data: GunnyInward[]
    isLoading: boolean
    error: Error | null
    queryParams: GunnyInwardQueryParams
    setQueryParams: React.Dispatch<React.SetStateAction<GunnyInwardQueryParams>>
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasPrevPage: boolean
        hasNextPage: boolean
        prevPage: number | null
        nextPage: number | null
    } | null
}

const GunnyInwardContext = React.createContext<GunnyInwardContextType | null>(
    null
)

type GunnyInwardProviderProps = {
    millId: string
    children: React.ReactNode
}

export function GunnyInwardProvider({
    millId,
    children,
}: GunnyInwardProviderProps) {
    const [open, setOpen] = useDialogState<GunnyInwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<GunnyInward | null>(null)
    const [queryParams, setQueryParams] = useState<GunnyInwardQueryParams>({
        page: 1,
        limit: 10,
    })

    // Fetch data using React Query
    const {
        data: response,
        isLoading,
        error,
    } = useGunnyInwardList(millId, queryParams)

    const value: GunnyInwardContextType = {
        millId,
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        data: response?.entries || [],
        isLoading,
        error: error as Error | null,
        queryParams,
        setQueryParams,
        pagination: response?.pagination || null,
    }

    return <GunnyInwardContext value={value}>{children}</GunnyInwardContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export const gunnyInward = () => {
    const context = React.useContext(GunnyInwardContext)

    if (!context) {
        throw new Error(
            'gunnyInward has to be used within <GunnyInwardContext>'
        )
    }

    return context
}
