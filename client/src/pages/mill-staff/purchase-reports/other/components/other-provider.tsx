import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type OtherPurchase } from '../data/schema'

type OtherDialogType = 'add' | 'edit' | 'delete'

type OtherContextType = {
    open: OtherDialogType | null
    setOpen: (str: OtherDialogType | null) => void
    currentRow: OtherPurchase | null
    setCurrentRow: React.Dispatch<React.SetStateAction<OtherPurchase | null>>
}

const OtherContext = React.createContext<OtherContextType | null>(null)

export function OtherProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<OtherDialogType>(null)
    const [currentRow, setCurrentRow] = useState<OtherPurchase | null>(null)

    return (
        <OtherContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </OtherContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOther = () => {
    const otherContext = React.useContext(OtherContext)

    if (!otherContext) {
        throw new Error('useOther has to be used within <OtherContext>')
    }

    return otherContext
}
