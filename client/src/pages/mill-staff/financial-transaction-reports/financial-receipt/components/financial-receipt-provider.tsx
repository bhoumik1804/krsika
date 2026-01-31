import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type FinancialReceipt as FinancialReceiptType } from '../data/schema'

type FinancialReceiptDialogType = 'add' | 'edit' | 'delete'

type FinancialReceiptContextType = {
    open: FinancialReceiptDialogType | null
    setOpen: (str: FinancialReceiptDialogType | null) => void
    currentRow: FinancialReceiptType | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<FinancialReceiptType | null>
    >
}

const FinancialReceiptContext =
    React.createContext<FinancialReceiptContextType | null>(null)

export function FinancialReceiptProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<FinancialReceiptDialogType>(null)
    const [currentRow, setCurrentRow] = useState<FinancialReceiptType | null>(
        null
    )

    return (
        <FinancialReceiptContext
            value={{ open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </FinancialReceiptContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const FinancialReceipt = () => {
    const context = React.useContext(FinancialReceiptContext)

    if (!context) {
        throw new Error(
            'FinancialReceipt has to be used within <FinancialReceiptContext>'
        )
    }

    return context
}
