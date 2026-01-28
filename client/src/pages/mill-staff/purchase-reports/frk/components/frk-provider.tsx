import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type FrkPurchase } from '../data/schema'

type FrkDialogType = 'add' | 'edit' | 'delete'

type FrkContextType = {
    open: FrkDialogType | null
    setOpen: (str: FrkDialogType | null) => void
    currentRow: FrkPurchase | null
    setCurrentRow: React.Dispatch<React.SetStateAction<FrkPurchase | null>>
}

const FrkContext = React.createContext<FrkContextType | null>(null)

export function FrkProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<FrkDialogType>(null)
    const [currentRow, setCurrentRow] = useState<FrkPurchase | null>(null)

    return (
        <FrkContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </FrkContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFrk = () => {
    const frkContext = React.useContext(FrkContext)

    if (!frkContext) {
        throw new Error('useFrk has to be used within <FrkContext>')
    }

    return frkContext
}
