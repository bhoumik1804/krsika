import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type SalesDeal } from '../data/schema'

type SalesDealsDialogType = 'add' | 'edit' | 'delete'

type SalesDealsContextType = {
    open: SalesDealsDialogType | null
    setOpen: (str: SalesDealsDialogType | null) => void
    currentRow: SalesDeal | null
    setCurrentRow: React.Dispatch<React.SetStateAction<SalesDeal | null>>
}

const SalesDealsContext = React.createContext<SalesDealsContextType | null>(
    null
)

export function SalesDealsProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<SalesDealsDialogType>(null)
    const [currentRow, setCurrentRow] = useState<SalesDeal | null>(null)

    return (
        <SalesDealsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </SalesDealsContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSalesDeals = () => {
    const context = React.useContext(SalesDealsContext)

    if (!context) {
        throw new Error(
            'useSalesDeals has to be used within <SalesDealsContext>'
        )
    }

    return context
}
