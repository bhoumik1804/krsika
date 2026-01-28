import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type BalanceLiftingSalesPaddy } from '../data/schema'

type BalanceLiftingSalesPaddyDialogType = 'add' | 'edit' | 'delete'

type BalanceLiftingSalesPaddyContextType = {
    open: BalanceLiftingSalesPaddyDialogType | null
    setOpen: (str: BalanceLiftingSalesPaddyDialogType | null) => void
    currentRow: BalanceLiftingSalesPaddy | null
    setCurrentRow: React.Dispatch<React.SetStateAction<BalanceLiftingSalesPaddy | null>>
}

const BalanceLiftingSalesPaddyContext = React.createContext<BalanceLiftingSalesPaddyContextType | null>(null)

export function BalanceLiftingSalesPaddyProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<BalanceLiftingSalesPaddyDialogType>(null)
    const [currentRow, setCurrentRow] = useState<BalanceLiftingSalesPaddy | null>(null)

    return (
        <BalanceLiftingSalesPaddyContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </BalanceLiftingSalesPaddyContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const balanceLiftingSalesPaddy = () => {
    const context = React.useContext(BalanceLiftingSalesPaddyContext)

    if (!context) {
        throw new Error('balanceLiftingSalesPaddy has to be used within <BalanceLiftingSalesPaddyContext>')
    }

    return context
}
