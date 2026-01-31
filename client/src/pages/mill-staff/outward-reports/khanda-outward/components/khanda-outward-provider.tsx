import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type KhandaOutward } from '../data/schema'

type KhandaOutwardDialogType = 'add' | 'edit' | 'delete'

type KhandaOutwardContextType = {
    open: KhandaOutwardDialogType | null
    setOpen: (str: KhandaOutwardDialogType | null) => void
    currentRow: KhandaOutward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<KhandaOutward | null>>
}

const KhandaOutwardContext = React.createContext<KhandaOutwardContextType | null>(null)

export function KhandaOutwardProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<KhandaOutwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<KhandaOutward | null>(null)

    return (
        <KhandaOutwardContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </KhandaOutwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const khandaOutward = () => {
    const context = React.useContext(KhandaOutwardContext)

    if (!context) {
        throw new Error('khandaOutward has to be used within <KhandaOutwardContext>')
    }

    return context
}
