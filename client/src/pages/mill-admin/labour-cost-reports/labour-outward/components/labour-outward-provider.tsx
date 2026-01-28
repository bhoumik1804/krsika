import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type LabourOutward } from '../data/schema'

type LabourOutwardDialogType = 'add' | 'edit' | 'delete'

type LabourOutwardContextType = {
    open: LabourOutwardDialogType | null
    setOpen: (str: LabourOutwardDialogType | null) => void
    currentRow: LabourOutward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<LabourOutward | null>>
}

const LabourOutwardContext = React.createContext<LabourOutwardContextType | null>(null)

export function LabourOutwardProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<LabourOutwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<LabourOutward | null>(null)

    return (
        <LabourOutwardContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </LabourOutwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const labourOutward = () => {
    const context = React.useContext(LabourOutwardContext)

    if (!context) {
        throw new Error('labourOutward has to be used within <LabourOutwardContext>')
    }

    return context
}
