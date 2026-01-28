import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type BalanceLiftingPurchasesPaddy } from '../data/schema'

type PaddyDialogType = 'add' | 'edit' | 'delete'

type BalanceLiftingPurchasesPaddyContextType = {
    open: PaddyDialogType | null
    setOpen: (str: PaddyDialogType | null) => void
    currentRow: BalanceLiftingPurchasesPaddy | null
    setCurrentRow: React.Dispatch<React.SetStateAction<BalanceLiftingPurchasesPaddy | null>>
}

const BalanceLiftingPurchasesPaddyContext = React.createContext<BalanceLiftingPurchasesPaddyContextType | null>(null)

export function BalanceLiftingPurchasesPaddyProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<PaddyDialogType>(null)
    const [currentRow, setCurrentRow] = useState<BalanceLiftingPurchasesPaddy | null>(null)

    return (
        <BalanceLiftingPurchasesPaddyContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </BalanceLiftingPurchasesPaddyContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const balanceLiftingPurchasesPaddy = () => {
    const paddyContext = React.useContext(BalanceLiftingPurchasesPaddyContext)

    if (!paddyContext) {
        throw new Error('balanceLiftingPurchasesPaddy has to be used within <BalanceLiftingPurchasesPaddyContext>')
    }

    return paddyContext
}
