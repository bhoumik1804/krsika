import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type KodhaOutward } from '../data/schema'

type KodhaOutwardDialogType = 'add' | 'edit' | 'delete' | 'delete-multi'

type KodhaOutwardContextType = {
    open: KodhaOutwardDialogType | null
    setOpen: (str: KodhaOutwardDialogType | null) => void
    currentRow: KodhaOutward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<KodhaOutward | null>>
}

const KodhaOutwardContext = React.createContext<KodhaOutwardContextType | null>(
    null
)

export function KodhaOutwardProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<KodhaOutwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<KodhaOutward | null>(null)

    return (
        <KodhaOutwardContext.Provider
            value={{ open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </KodhaOutwardContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const kodhaOutward = () => {
    const context = React.useContext(KodhaOutwardContext)
    if (!context) {
        throw new Error(
            'kodhaOutward has to be used within <KodhaOutwardContext>'
        )
    }
    return context
}
