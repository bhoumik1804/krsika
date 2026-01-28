import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type PartyReportData } from '../data/schema'

type PartyReportDialogType = 'add' | 'edit' | 'delete'

type PartyReportContextType = {
    open: PartyReportDialogType | null
    setOpen: (str: PartyReportDialogType | null) => void
    currentRow: PartyReportData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<PartyReportData | null>>
}

const PartyReportContext = React.createContext<PartyReportContextType | null>(null)

export function PartyReportProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<PartyReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PartyReportData | null>(null)

    return (
        <PartyReportContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </PartyReportContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const partyReport = () => {
    const context = React.useContext(PartyReportContext)

    if (!context) {
        throw new Error('partyReport has to be used within <PartyReportContext>')
    }

    return context
}
