import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type LabourOther } from '../data/schema'

type LabourOtherDialogType = 'add' | 'edit' | 'delete'

type LabourOtherContextType = {
    open: LabourOtherDialogType | null
    setOpen: (str: LabourOtherDialogType | null) => void
    currentRow: LabourOther | null
    setCurrentRow: React.Dispatch<React.SetStateAction<LabourOther | null>>
}

const LabourOtherContext = React.createContext<LabourOtherContextType | null>(null)

export function LabourOtherProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<LabourOtherDialogType>(null)
    const [currentRow, setCurrentRow] = useState<LabourOther | null>(null)

    return (
        <LabourOtherContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </LabourOtherContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const labourOther = () => {
    const context = React.useContext(LabourOtherContext)

    if (!context) {
        throw new Error('labourOther has to be used within <LabourOtherContext>')
    }

    return context
}
