import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type NakkhiOutward } from '../data/schema'
import type { NakkhiOutwardListResponse } from '../data/types'

type NakkhiOutwardDialogType = 'add' | 'edit' | 'delete' | 'delete-multi'

type NakkhiOutwardContextType = {
    open: NakkhiOutwardDialogType | null
    setOpen: (str: NakkhiOutwardDialogType | null) => void
    currentRow: NakkhiOutward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<NakkhiOutward | null>>
    millId: string
    apiData: NakkhiOutwardListResponse | undefined
}

const NakkhiOutwardContext =
    React.createContext<NakkhiOutwardContextType | null>(null)

type NakkhiOutwardProviderProps = {
    children: React.ReactNode
    millId: string
    apiData?: NakkhiOutwardListResponse
}

export function NakkhiOutwardProvider({
    children,
    millId,
    apiData,
}: NakkhiOutwardProviderProps) {
    const [open, setOpen] = useDialogState<NakkhiOutwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<NakkhiOutward | null>(null)

    return (
        <NakkhiOutwardContext
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
        </NakkhiOutwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const nakkhiOutward = () => {
    const context = React.useContext(NakkhiOutwardContext)

    if (!context) {
        throw new Error(
            'nakkhiOutward has to be used within <NakkhiOutwardContext>'
        )
    }

    return context
}
