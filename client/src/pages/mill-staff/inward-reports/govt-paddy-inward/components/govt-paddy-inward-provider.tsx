import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type GovtPaddyInward } from '../data/schema'

type GovtPaddyInwardDialogType = 'add' | 'edit' | 'delete'

type GovtPaddyInwardContextType = {
    open: GovtPaddyInwardDialogType | null
    setOpen: (str: GovtPaddyInwardDialogType | null) => void
    currentRow: GovtPaddyInward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<GovtPaddyInward | null>>
}

const GovtPaddyInwardContext = React.createContext<GovtPaddyInwardContextType | null>(null)

export function GovtPaddyInwardProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<GovtPaddyInwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<GovtPaddyInward | null>(null)

    return (
        <GovtPaddyInwardContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </GovtPaddyInwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const govtPaddyInward = () => {
    const context = React.useContext(GovtPaddyInwardContext)

    if (!context) {
        throw new Error('govtPaddyInward has to be used within <GovtPaddyInwardContext>')
    }

    return context
}
