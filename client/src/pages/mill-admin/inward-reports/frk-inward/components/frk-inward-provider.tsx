import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type FrkInward } from '../data/schema'

type FrkInwardDialogType = 'add' | 'edit' | 'delete'

type FrkInwardContextType = {
    open: FrkInwardDialogType | null
    setOpen: (str: FrkInwardDialogType | null) => void
    currentRow: FrkInward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<FrkInward | null>>
    millId: string
}

const FrkInwardContext = React.createContext<FrkInwardContextType | null>(null)

export function FrkInwardProvider({
    children,
    millId,
}: {
    children: React.ReactNode
    millId: string
}) {
    const [open, setOpen] = useDialogState<FrkInwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<FrkInward | null>(null)

    return (
        <FrkInwardContext
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                millId,
            }}
        >
            {children}
        </FrkInwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFrkInward = () => {
    const context = React.useContext(FrkInwardContext)

    if (!context) {
        throw new Error('useFrkInward has to be used within <FrkInwardContext>')
    }

    return context
}
