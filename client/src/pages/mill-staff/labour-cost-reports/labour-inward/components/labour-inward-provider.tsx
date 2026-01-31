import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type LabourInward } from '../data/schema'

type LabourInwardDialogType = 'add' | 'edit' | 'delete'

type LabourInwardContextType = {
    open: LabourInwardDialogType | null
    setOpen: (str: LabourInwardDialogType | null) => void
    currentRow: LabourInward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<LabourInward | null>>
}

const LabourInwardContext = React.createContext<LabourInwardContextType | null>(null)

export function LabourInwardProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<LabourInwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<LabourInward | null>(null)

    return (
        <LabourInwardContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </LabourInwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const labourInward = () => {
    const context = React.useContext(LabourInwardContext)

    if (!context) {
        throw new Error('labourInward has to be used within <LabourInwardContext>')
    }

    return context
}
