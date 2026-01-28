import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type FrkOutward } from '../data/schema'

type FrkOutwardDialogType = 'add' | 'edit' | 'delete' | 'delete-multi'

type FrkOutwardContextType = {
    open: FrkOutwardDialogType | null
    setOpen: (str: FrkOutwardDialogType | null) => void
    currentRow: FrkOutward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<FrkOutward | null>>
}

const FrkOutwardContext = React.createContext<FrkOutwardContextType | null>(
    null
)

export function FrkOutwardProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<FrkOutwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<FrkOutward | null>(null)

    return (
        <FrkOutwardContext.Provider
            value={{ open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </FrkOutwardContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const frkOutward = () => {
    const context = React.useContext(FrkOutwardContext)

    if (!context) {
        throw new Error('frkOutward has to be used within <FrkOutwardContext>')
    }

    return context
}
