import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type MillingRice } from '../data/schema'

type MillingRiceDialogType = 'add' | 'edit' | 'delete'

type MillingRiceContextType = {
    open: MillingRiceDialogType | null
    setOpen: (str: MillingRiceDialogType | null) => void
    currentRow: MillingRice | null
    setCurrentRow: React.Dispatch<React.SetStateAction<MillingRice | null>>
}

const MillingRiceContext = React.createContext<MillingRiceContextType | null>(null)

export function MillingRiceProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<MillingRiceDialogType>(null)
    const [currentRow, setCurrentRow] = useState<MillingRice | null>(null)

    return (
        <MillingRiceContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </MillingRiceContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const millingRice = () => {
    const context = React.useContext(MillingRiceContext)

    if (!context) {
        throw new Error('millingRice has to be used within <MillingRiceContext>')
    }

    return context
}
