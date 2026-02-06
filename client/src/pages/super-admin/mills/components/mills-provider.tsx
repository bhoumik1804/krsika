import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Mill } from '../data/schema'

type MillsDialogType = 'invite' | 'add' | 'edit' | 'delete' | 'reject'

type MillsContextType = {
    open: MillsDialogType | null
    setOpen: (str: MillsDialogType | null) => void
    currentRow: Mill | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Mill | null>>
}

const MillsContext = React.createContext<MillsContextType | null>(null)

export function MillsProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<MillsDialogType>(null)
    const [currentRow, setCurrentRow] = useState<Mill | null>(null)

    return (
        <MillsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </MillsContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMills = () => {
    const millsContext = React.useContext(MillsContext)

    if (!millsContext) {
        throw new Error('useMills has to be used within <MillsContext>')
    }

    return millsContext
}
