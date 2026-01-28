import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type StaffReportData } from '../data/schema'

type StaffReportDialogType = 'add' | 'edit' | 'delete'

type StaffReportContextType = {
    open: StaffReportDialogType | null
    setOpen: (str: StaffReportDialogType | null) => void
    currentRow: StaffReportData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<StaffReportData | null>>
}

const StaffReportContext = React.createContext<StaffReportContextType | null>(null)

export function StaffReportProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<StaffReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<StaffReportData | null>(null)

    return (
        <StaffReportContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </StaffReportContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const staffReport = () => {
    const context = React.useContext(StaffReportContext)

    if (!context) {
        throw new Error('staffReport has to be used within <StaffReportContext>')
    }

    return context
}
