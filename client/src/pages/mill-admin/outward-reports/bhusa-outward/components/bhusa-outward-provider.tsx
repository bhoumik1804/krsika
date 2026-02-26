import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type BhusaOutward } from '../data/schema'
import type { BhusaOutwardListResponse } from '../data/types'

type BhusaOutwardDialogType = 'add' | 'edit' | 'delete' | 'delete-multi'

type BhusaOutwardContextType = {
    millId: string
    open: BhusaOutwardDialogType | null
    setOpen: (str: BhusaOutwardDialogType | null) => void
    currentRow: BhusaOutward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<BhusaOutward | null>>
    apiData: BhusaOutwardListResponse | undefined
}

const BhusaOutwardContext = React.createContext<BhusaOutwardContextType | null>(
    null
)

export function BhusaOutwardProvider({
    children,
    millId,
    apiData,
}: {
    children: React.ReactNode
    millId: string
    apiData: BhusaOutwardListResponse | undefined
}) {
    const [open, setOpen] = useDialogState<BhusaOutwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<BhusaOutward | null>(null)

    return (
        <BhusaOutwardContext.Provider
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
        </BhusaOutwardContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const bhusaOutward = () => {
    const context = React.useContext(BhusaOutwardContext)

    if (!context) {
        throw new Error(
            'bhusaOutward has to be used within <BhusaOutwardContext>'
        )
    }

    return context
}
