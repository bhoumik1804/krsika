import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type PaddySales } from '../data/schema'

type PaddySalesDialogType = 'add' | 'edit' | 'delete'

type PaddySalesContextType = {
    open: PaddySalesDialogType | null
    setOpen: (str: PaddySalesDialogType | null) => void
    currentRow: PaddySales | null
    setCurrentRow: React.Dispatch<React.SetStateAction<PaddySales | null>>
}

const PaddySalesContext = React.createContext<PaddySalesContextType | null>(null)

export function PaddySalesProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<PaddySalesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PaddySales | null>(null)

    return (
        <PaddySalesContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </PaddySalesContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const paddySales = () => {
    const context = React.useContext(PaddySalesContext)

    if (!context) {
        throw new Error('paddySales has to be used within <PaddySalesContext>')
    }

    return context
}
