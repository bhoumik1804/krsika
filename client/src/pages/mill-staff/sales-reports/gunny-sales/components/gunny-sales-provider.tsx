import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type GunnySales } from '../data/schema'

type GunnySalesDialogType = 'add' | 'edit' | 'delete'

type GunnySalesContextType = {
    open: GunnySalesDialogType | null
    setOpen: (str: GunnySalesDialogType | null) => void
    currentRow: GunnySales | null
    setCurrentRow: React.Dispatch<React.SetStateAction<GunnySales | null>>
}

const GunnySalesContext = React.createContext<GunnySalesContextType | null>(null)

export function GunnySalesProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<GunnySalesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<GunnySales | null>(null)

    return (
        <GunnySalesContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </GunnySalesContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const gunnySales = () => {
    const context = React.useContext(GunnySalesContext)

    if (!context) {
        throw new Error('gunnySales has to be used within <GunnySalesContext>')
    }

    return context
}
