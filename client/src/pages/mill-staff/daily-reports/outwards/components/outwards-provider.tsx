import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type OutwardEntry } from '../data/schema'

type OutwardsDialogType = 'add' | 'edit' | 'delete'

type OutwardsContextType = {
    open: OutwardsDialogType | null
    setOpen: (str: OutwardsDialogType | null) => void
    currentRow: OutwardEntry | null
    setCurrentRow: React.Dispatch<React.SetStateAction<OutwardEntry | null>>
}

const OutwardsContext = React.createContext<OutwardsContextType | null>(null)

export function OutwardsProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<OutwardsDialogType>(null)
    const [currentRow, setCurrentRow] = useState<OutwardEntry | null>(null)

    return (
        <OutwardsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </OutwardsContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOutwards = () => {
    const context = React.useContext(OutwardsContext)

    if (!context) {
        throw new Error('useOutwards has to be used within <OutwardsContext>')
    }

    return context
}
