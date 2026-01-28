import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type OtherSales } from '../data/schema'

type OtherSalesDialogType = 'add' | 'edit' | 'delete'

type OtherSalesContextType = {
    open: OtherSalesDialogType | null
    setOpen: (str: OtherSalesDialogType | null) => void
    currentRow: OtherSales | null
    setCurrentRow: React.Dispatch<React.SetStateAction<OtherSales | null>>
}

const OtherSalesContext = React.createContext<OtherSalesContextType | null>(null)

export function OtherSalesProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<OtherSalesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<OtherSales | null>(null)

    return (
        <OtherSalesContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </OtherSalesContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const otherSales = () => {
    const context = React.useContext(OtherSalesContext)

    if (!context) {
        throw new Error('otherSales has to be used within <OtherSalesContext>')
    }

    return context
}
