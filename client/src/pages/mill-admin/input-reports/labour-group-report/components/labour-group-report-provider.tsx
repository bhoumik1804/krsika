import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type LabourGroupReportData } from '../data/schema'

type LabourGroupReportDialogType = 'add' | 'edit' | 'delete'

type LabourGroupReportContextType = {
    open: LabourGroupReportDialogType | null
    setOpen: (str: LabourGroupReportDialogType | null) => void
    currentRow: LabourGroupReportData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<LabourGroupReportData | null>>
}

const LabourGroupReportContext = React.createContext<LabourGroupReportContextType | null>(null)

export function LabourGroupReportProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<LabourGroupReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<LabourGroupReportData | null>(null)

    return (
        <LabourGroupReportContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </LabourGroupReportContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const labourGroupReport = () => {
    const context = React.useContext(LabourGroupReportContext)

    if (!context) {
        throw new Error('labourGroupReport has to be used within <LabourGroupReportContext>')
    }

    return context
}
