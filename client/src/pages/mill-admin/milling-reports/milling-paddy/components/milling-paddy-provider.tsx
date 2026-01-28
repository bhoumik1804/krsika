import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type MillingPaddy } from '../data/schema'

type MillingPaddyDialogType = 'add' | 'edit' | 'delete'

type MillingPaddyContextType = {
    open: MillingPaddyDialogType | null
    setOpen: (str: MillingPaddyDialogType | null) => void
    currentRow: MillingPaddy | null
    setCurrentRow: React.Dispatch<React.SetStateAction<MillingPaddy | null>>
}

const MillingPaddyContext = React.createContext<MillingPaddyContextType | null>(null)

export function MillingPaddyProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<MillingPaddyDialogType>(null)
    const [currentRow, setCurrentRow] = useState<MillingPaddy | null>(null)

    return (
        <MillingPaddyContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </MillingPaddyContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const millingPaddy = () => {
    const context = React.useContext(MillingPaddyContext)

    if (!context) {
        throw new Error('millingPaddy has to be used within <MillingPaddyContext>')
    }

    return context
}
