import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type ReceiptEntry } from '../data/schema'

type ReceiptDialogType = 'add' | 'edit' | 'delete'

type ReceiptContextType = {
    open: ReceiptDialogType | null
    setOpen: (str: ReceiptDialogType | null) => void
    currentRow: ReceiptEntry | null
    setCurrentRow: React.Dispatch<React.SetStateAction<ReceiptEntry | null>>
}

const ReceiptContext = React.createContext<ReceiptContextType | null>(null)

export function ReceiptProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<ReceiptDialogType>(null)
    const [currentRow, setCurrentRow] = useState<ReceiptEntry | null>(null)

    return (
        <ReceiptContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </ReceiptContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useReceipt = () => {
    const context = React.useContext(ReceiptContext)

    if (!context) {
        throw new Error('useReceipt has to be used within <ReceiptContext>')
    }

    return context
}
