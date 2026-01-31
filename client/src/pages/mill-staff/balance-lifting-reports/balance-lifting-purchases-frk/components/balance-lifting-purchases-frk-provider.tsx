import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type BalanceLiftingPurchasesFrk } from '../data/schema'

type FrkDialogType = 'add' | 'edit' | 'delete'

type BalanceLiftingPurchasesFrkContextType = {
    open: FrkDialogType | null
    setOpen: (str: FrkDialogType | null) => void
    currentRow: BalanceLiftingPurchasesFrk | null
    setCurrentRow: React.Dispatch<React.SetStateAction<BalanceLiftingPurchasesFrk | null>>
}

const BalanceLiftingPurchasesFrkContext = React.createContext<BalanceLiftingPurchasesFrkContextType | null>(null)

export function BalanceLiftingPurchasesFrkProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<FrkDialogType>(null)
    const [currentRow, setCurrentRow] = useState<BalanceLiftingPurchasesFrk | null>(null)

    return (
        <BalanceLiftingPurchasesFrkContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </BalanceLiftingPurchasesFrkContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const balanceLiftingPurchasesFrk = () => {
    const frkContext = React.useContext(BalanceLiftingPurchasesFrkContext)

    if (!frkContext) {
        throw new Error('balanceLiftingPurchasesFrk has to be used within <BalanceLiftingPurchasesFrkContext>')
    }

    return frkContext
}
