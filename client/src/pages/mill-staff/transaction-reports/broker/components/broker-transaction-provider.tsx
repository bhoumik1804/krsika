import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type BrokerTransaction } from '../data/schema'

type PaddyDialogType = 'add' | 'edit' | 'delete'

type PaddyContextType = {
    open: PaddyDialogType | null
    setOpen: (str: PaddyDialogType | null) => void
    currentRow: BrokerTransaction | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<BrokerTransaction | null>
    >
}

const BrokerTransactionContext = React.createContext<PaddyContextType | null>(
    null
)

export function BrokerTransactionProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<PaddyDialogType>(null)
    const [currentRow, setCurrentRow] = useState<BrokerTransaction | null>(null)

    return (
        <BrokerTransactionContext
            value={{ open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </BrokerTransactionContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBrokerTransaction = () => {
    const paddyContext = React.useContext(BrokerTransactionContext)

    if (!paddyContext) {
        throw new Error('usePaddy has to be used within <PaddyContext>')
    }

    return paddyContext
}
