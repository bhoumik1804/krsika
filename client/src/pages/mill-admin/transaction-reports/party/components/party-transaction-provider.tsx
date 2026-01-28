import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type PartyTransaction } from '../data/schema'

type PaddyDialogType = 'add' | 'edit' | 'delete'

type PaddyContextType = {
    open: PaddyDialogType | null
    setOpen: (str: PaddyDialogType | null) => void
    currentRow: PartyTransaction | null
    setCurrentRow: React.Dispatch<React.SetStateAction<PartyTransaction | null>>
}

const PartyTransactionContext = React.createContext<PaddyContextType | null>(
    null
)

export function PartyTransactionProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<PaddyDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PartyTransaction | null>(null)

    return (
        <PartyTransactionContext
            value={{ open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </PartyTransactionContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePartyTransaction = () => {
    const partyTransactionContext = React.useContext(PartyTransactionContext)

    if (!partyTransactionContext) {
        throw new Error(
            'usePartyTransaction has to be used within <PartyTransactionContext>'
        )
    }

    return partyTransactionContext
}
