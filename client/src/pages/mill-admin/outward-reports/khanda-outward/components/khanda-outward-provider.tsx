import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type KhandaOutward } from '../data/schema'
import type { KhandaOutwardListResponse } from '../data/types'

type KhandaOutwardDialogType = 'add' | 'edit' | 'delete' | 'delete-multi'

type KhandaOutwardContextType = {
    open: KhandaOutwardDialogType | null
    setOpen: (str: KhandaOutwardDialogType | null) => void
    currentRow: KhandaOutward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<KhandaOutward | null>>
    millId: string
    apiData: KhandaOutwardListResponse | undefined
}

const KhandaOutwardContext =
    React.createContext<KhandaOutwardContextType | null>(null)

type KhandaOutwardProviderProps = {
    children: React.ReactNode
    millId: string
    apiData?: KhandaOutwardListResponse
}

export function KhandaOutwardProvider({
    children,
    millId,
    apiData,
}: KhandaOutwardProviderProps) {
    const [open, setOpen] = useDialogState<KhandaOutwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<KhandaOutward | null>(null)

    return (
        <KhandaOutwardContext
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                millId,
                apiData,
            }}
        >
            {children}
        </KhandaOutwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const khandaOutward = () => {
    const context = React.useContext(KhandaOutwardContext)

    if (!context) {
        throw new Error(
            'khandaOutward has to be used within <KhandaOutwardContext>'
        )
    }

    return context
}
