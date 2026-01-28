import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type KhandaSales } from '../data/schema'

type KhandaSalesDialogType = 'add' | 'edit' | 'delete'

type KhandaSalesContextType = {
    open: KhandaSalesDialogType | null
    setOpen: (str: KhandaSalesDialogType | null) => void
    currentRow: KhandaSales | null
    setCurrentRow: React.Dispatch<React.SetStateAction<KhandaSales | null>>
}

const KhandaSalesContext = React.createContext<KhandaSalesContextType | null>(null)

export function KhandaSalesProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<KhandaSalesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<KhandaSales | null>(null)

    return (
        <KhandaSalesContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </KhandaSalesContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const khandaSales = () => {
    const context = React.useContext(KhandaSalesContext)

    if (!context) {
        throw new Error('khandaSales has to be used within <KhandaSalesContext>')
    }

    return context
}
