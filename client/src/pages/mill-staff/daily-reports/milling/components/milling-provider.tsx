import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type MillingEntry } from '../data/schema'

type MillingDialogType = 'add' | 'edit' | 'delete'

type MillingContextType = {
    open: MillingDialogType | null
    setOpen: (str: MillingDialogType | null) => void
    currentRow: MillingEntry | null
    setCurrentRow: React.Dispatch<React.SetStateAction<MillingEntry | null>>
}

const MillingContext = React.createContext<MillingContextType | null>(null)

export function MillingProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<MillingDialogType>(null)
    const [currentRow, setCurrentRow] = useState<MillingEntry | null>(null)

    return (
        <MillingContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </MillingContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMilling = () => {
    const context = React.useContext(MillingContext)

    if (!context) {
        throw new Error('useMilling has to be used within <MillingContext>')
    }

    return context
}
