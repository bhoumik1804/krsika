import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type BalanceLiftingPurchasesRice } from '../data/schema'

type RiceDialogType = 'add' | 'edit' | 'delete'

type BalanceLiftingPurchasesRiceContextType = {
    open: RiceDialogType | null
    setOpen: (str: RiceDialogType | null) => void
    currentRow: BalanceLiftingPurchasesRice | null
    setCurrentRow: React.Dispatch<React.SetStateAction<BalanceLiftingPurchasesRice | null>>
}

const BalanceLiftingPurchasesRiceContext = React.createContext<BalanceLiftingPurchasesRiceContextType | null>(null)

export function BalanceLiftingPurchasesRiceProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<RiceDialogType>(null)
    const [currentRow, setCurrentRow] = useState<BalanceLiftingPurchasesRice | null>(null)

    return (
        <BalanceLiftingPurchasesRiceContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </BalanceLiftingPurchasesRiceContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const balanceLiftingPurchasesRice = () => {
    const context = React.useContext(BalanceLiftingPurchasesRiceContext)

    if (!context) {
        throw new Error('balanceLiftingPurchasesRice has to be used within <BalanceLiftingPurchasesRiceContext>')
    }

    return context
}
