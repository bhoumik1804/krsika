import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type BrokerReportData } from '../data/schema'

type BrokerReportDialogType = 'add' | 'edit' | 'delete'

type BrokerReportContextType = {
    open: BrokerReportDialogType | null
    setOpen: (str: BrokerReportDialogType | null) => void
    currentRow: BrokerReportData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<BrokerReportData | null>>
}

const BrokerReportContext = React.createContext<BrokerReportContextType | null>(null)

export function BrokerReportProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<BrokerReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<BrokerReportData | null>(null)

    return (
        <BrokerReportContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </BrokerReportContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const brokerReport = () => {
    const context = React.useContext(BrokerReportContext)

    if (!context) {
        throw new Error('brokerReport has to be used within <BrokerReportContext>')
    }

    return context
}
