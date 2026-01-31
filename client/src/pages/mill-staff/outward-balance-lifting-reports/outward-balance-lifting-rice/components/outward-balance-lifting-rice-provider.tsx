import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type OutwardBalanceLiftingRice } from '../data/schema'

type OutwardBalanceLiftingRiceDialogType = 'add' | 'edit' | 'delete'

type OutwardBalanceLiftingRiceContextType = {
    open: OutwardBalanceLiftingRiceDialogType | null
    setOpen: (str: OutwardBalanceLiftingRiceDialogType | null) => void
    currentRow: OutwardBalanceLiftingRice | null
    setCurrentRow: React.Dispatch<React.SetStateAction<OutwardBalanceLiftingRice | null>>
}

const OutwardBalanceLiftingRiceContext = React.createContext<OutwardBalanceLiftingRiceContextType | null>(null)

export function OutwardBalanceLiftingRiceProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<OutwardBalanceLiftingRiceDialogType>(null)
    const [currentRow, setCurrentRow] = useState<OutwardBalanceLiftingRice | null>(null)

    return (
        <OutwardBalanceLiftingRiceContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </OutwardBalanceLiftingRiceContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const outwardBalanceLiftingRice = () => {
    const context = React.useContext(OutwardBalanceLiftingRiceContext)

    if (!context) {
        throw new Error('outwardBalanceLiftingRice has to be used within <OutwardBalanceLiftingRiceContext>')
    }

    return context
}
