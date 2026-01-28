import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type InwardEntry } from '../data/schema'

type InwardsDialogType = 'add' | 'edit' | 'delete'

type InwardsContextType = {
    open: InwardsDialogType | null
    setOpen: (str: InwardsDialogType | null) => void
    currentRow: InwardEntry | null
    setCurrentRow: React.Dispatch<React.SetStateAction<InwardEntry | null>>
}

const InwardsContext = React.createContext<InwardsContextType | null>(null)

export function InwardsProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<InwardsDialogType>(null)
    const [currentRow, setCurrentRow] = useState<InwardEntry | null>(null)

    return (
        <InwardsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </InwardsContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useInwards = () => {
    const context = React.useContext(InwardsContext)

    if (!context) {
        throw new Error('useInwards has to be used within <InwardsContext>')
    }

    return context
}
