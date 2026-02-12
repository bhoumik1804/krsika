import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type KodhaOutward } from '../data/schema'
import type { KodhaOutwardListResponse } from '../data/types'

type KodhaOutwardDialogType = 'add' | 'edit' | 'delete' | 'delete-multi'

type KodhaOutwardContextType = {
    millId: string
    open: KodhaOutwardDialogType | null
    setOpen: (str: KodhaOutwardDialogType | null) => void
    currentRow: KodhaOutward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<KodhaOutward | null>>
    apiData: KodhaOutwardListResponse | undefined
}

const KodhaOutwardContext = React.createContext<KodhaOutwardContextType | null>(
    null
)

export function KodhaOutwardProvider({
    children,
    millId,
    apiData,
}: {
    children: React.ReactNode
    millId: string
    apiData: KodhaOutwardListResponse | undefined
}) {
    const [open, setOpen] = useDialogState<KodhaOutwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<KodhaOutward | null>(null)

    return (
        <KodhaOutwardContext.Provider
            value={{
                millId,
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                apiData,
            }}
        >
            {children}
        </KodhaOutwardContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const kodhaOutward = () => {
    const context = React.useContext(KodhaOutwardContext)
    if (!context) {
        throw new Error(
            'kodhaOutward has to be used within <KodhaOutwardContext>'
        )
    }
    return context
}
