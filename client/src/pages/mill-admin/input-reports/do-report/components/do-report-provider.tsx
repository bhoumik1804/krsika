import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type DoReportData } from '../data/schema'

type DoReportDialogType = 'add' | 'edit' | 'delete'

type DoReportContextType = {
    open: DoReportDialogType | null
    setOpen: (str: DoReportDialogType | null) => void
    currentRow: DoReportData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<DoReportData | null>>
}

const DoReportContext = React.createContext<DoReportContextType | null>(null)

export function DoReportProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<DoReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<DoReportData | null>(null)

    return (
        <DoReportContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </DoReportContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const doReport = () => {
    const context = React.useContext(DoReportContext)

    if (!context) {
        throw new Error('doReport has to be used within <DoReportContext>')
    }

    return context
}
