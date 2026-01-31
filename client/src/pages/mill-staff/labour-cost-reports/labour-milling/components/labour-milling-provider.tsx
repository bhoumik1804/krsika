import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type LabourMilling } from '../data/schema'

type LabourMillingDialogType = 'add' | 'edit' | 'delete'

type LabourMillingContextType = {
    open: LabourMillingDialogType | null
    setOpen: (str: LabourMillingDialogType | null) => void
    currentRow: LabourMilling | null
    setCurrentRow: React.Dispatch<React.SetStateAction<LabourMilling | null>>
}

const LabourMillingContext = React.createContext<LabourMillingContextType | null>(null)

export function LabourMillingProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<LabourMillingDialogType>(null)
    const [currentRow, setCurrentRow] = useState<LabourMilling | null>(null)

    return (
        <LabourMillingContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </LabourMillingContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const labourMilling = () => {
    const context = React.useContext(LabourMillingContext)

    if (!context) {
        throw new Error('labourMilling has to be used within <LabourMillingContext>')
    }

    return context
}
