import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type RicePurchase } from '../data/schema'

type RiceDialogType = 'add' | 'edit' | 'delete'

type RiceContextType = {
    open: RiceDialogType | null
    setOpen: (str: RiceDialogType | null) => void
    currentRow: RicePurchase | null
    setCurrentRow: React.Dispatch<React.SetStateAction<RicePurchase | null>>
}

const RiceContext = React.createContext<RiceContextType | null>(null)

export function RiceProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<RiceDialogType>(null)
    const [currentRow, setCurrentRow] = useState<RicePurchase | null>(null)

    return (
        <RiceContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </RiceContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRice = () => {
    const context = React.useContext(RiceContext)

    if (!context) {
        throw new Error('useRice has to be used within <RiceContext>')
    }

    return context
}
