import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type PurchaseDeal } from '../data/schema'

type PurchaseDealsDialogType = 'add' | 'edit' | 'delete'

type PurchaseDealsContextType = {
    open: PurchaseDealsDialogType | null
    setOpen: (str: PurchaseDealsDialogType | null) => void
    currentRow: PurchaseDeal | null
    setCurrentRow: React.Dispatch<React.SetStateAction<PurchaseDeal | null>>
}

const PurchaseDealsContext =
    React.createContext<PurchaseDealsContextType | null>(null)

export function PurchaseDealsProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<PurchaseDealsDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PurchaseDeal | null>(null)

    return (
        <PurchaseDealsContext
            value={{ open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </PurchaseDealsContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePurchaseDeals = () => {
    const context = React.useContext(PurchaseDealsContext)

    if (!context) {
        throw new Error(
            'usePurchaseDeals has to be used within <PurchaseDealsContext>'
        )
    }

    return context
}
