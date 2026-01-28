import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type PaymentEntry } from '../data/schema'

type PaymentDialogType = 'add' | 'edit' | 'delete'

type PaymentContextType = {
    open: PaymentDialogType | null
    setOpen: (str: PaymentDialogType | null) => void
    currentRow: PaymentEntry | null
    setCurrentRow: React.Dispatch<React.SetStateAction<PaymentEntry | null>>
}

const PaymentContext = React.createContext<PaymentContextType | null>(null)

export function PaymentProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<PaymentDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PaymentEntry | null>(null)

    return (
        <PaymentContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </PaymentContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePayment = () => {
    const context = React.useContext(PaymentContext)

    if (!context) {
        throw new Error('usePayment has to be used within <PaymentContext>')
    }

    return context
}
