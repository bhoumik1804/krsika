import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type FinancialPayment } from '../data/schema'

type FinancialPaymentDialogType = 'add' | 'edit' | 'delete'

type FinancialPaymentContextType = {
    open: FinancialPaymentDialogType | null
    setOpen: (str: FinancialPaymentDialogType | null) => void
    currentRow: FinancialPayment | null
    setCurrentRow: React.Dispatch<React.SetStateAction<FinancialPayment | null>>
}

const FinancialPaymentContext =
    React.createContext<FinancialPaymentContextType | null>(null)

export function FinancialPaymentProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<FinancialPaymentDialogType>(null)
    const [currentRow, setCurrentRow] = useState<FinancialPayment | null>(null)

    return (
        <FinancialPaymentContext
            value={{ open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </FinancialPaymentContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFinancialPayment = () => {
    const context = React.useContext(FinancialPaymentContext)

    if (!context) {
        throw new Error(
            'useFinancialPayment has to be used within <FinancialPaymentContext>'
        )
    }

    return context
}
