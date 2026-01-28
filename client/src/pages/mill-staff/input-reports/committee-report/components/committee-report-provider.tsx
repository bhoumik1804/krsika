import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type CommitteeReportData } from '../data/schema'

type CommitteeReportDialogType = 'add' | 'edit' | 'delete'

type CommitteeReportContextType = {
    open: CommitteeReportDialogType | null
    setOpen: (str: CommitteeReportDialogType | null) => void
    currentRow: CommitteeReportData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<CommitteeReportData | null>>
}

const CommitteeReportContext = React.createContext<CommitteeReportContextType | null>(null)

export function CommitteeReportProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<CommitteeReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<CommitteeReportData | null>(null)

    return (
        <CommitteeReportContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </CommitteeReportContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const committeeReport = () => {
    const context = React.useContext(CommitteeReportContext)

    if (!context) {
        throw new Error('committeeReport has to be used within <CommitteeReportContext>')
    }

    return context
}
