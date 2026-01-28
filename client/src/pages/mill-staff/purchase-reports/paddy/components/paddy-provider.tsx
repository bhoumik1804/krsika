import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type PaddyPurchase } from '../data/schema'

type PaddyDialogType = 'add' | 'edit' | 'delete'

type PaddyContextType = {
    open: PaddyDialogType | null
    setOpen: (str: PaddyDialogType | null) => void
    currentRow: PaddyPurchase | null
    setCurrentRow: React.Dispatch<React.SetStateAction<PaddyPurchase | null>>
}

const PaddyContext = React.createContext<PaddyContextType | null>(null)

export function PaddyProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<PaddyDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PaddyPurchase | null>(null)

    return (
        <PaddyContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </PaddyContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePaddy = () => {
    const paddyContext = React.useContext(PaddyContext)

    if (!paddyContext) {
        throw new Error('usePaddy has to be used within <PaddyContext>')
    }

    return paddyContext
}
