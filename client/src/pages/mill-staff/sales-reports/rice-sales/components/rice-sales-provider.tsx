import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type RiceSales } from '../data/schema'

type RiceSalesDialogType = 'add' | 'edit' | 'delete'

type RiceSalesContextType = {
    open: RiceSalesDialogType | null
    setOpen: (str: RiceSalesDialogType | null) => void
    currentRow: RiceSales | null
    setCurrentRow: React.Dispatch<React.SetStateAction<RiceSales | null>>
}

const RiceSalesContext = React.createContext<RiceSalesContextType | null>(null)

export function RiceSalesProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<RiceSalesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<RiceSales | null>(null)

    return (
        <RiceSalesContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </RiceSalesContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const riceSales = () => {
    const context = React.useContext(RiceSalesContext)

    if (!context) {
        throw new Error('riceSales has to be used within <RiceSalesContext>')
    }

    return context
}
