import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type TransporterReportData } from '../data/schema'

type TransporterReportDialogType = 'add' | 'edit' | 'delete'

type TransporterReportContextType = {
    open: TransporterReportDialogType | null
    setOpen: (str: TransporterReportDialogType | null) => void
    currentRow: TransporterReportData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<TransporterReportData | null>>
}

const TransporterReportContext = React.createContext<TransporterReportContextType | null>(null)

export function TransporterReportProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<TransporterReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<TransporterReportData | null>(null)

    return (
        <TransporterReportContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </TransporterReportContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const transporterReport = () => {
    const context = React.useContext(TransporterReportContext)

    if (!context) {
        throw new Error('transporterReport has to be used within <TransporterReportContext>')
    }

    return context
}
