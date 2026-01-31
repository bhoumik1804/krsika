import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type SilkyKodhaOutward } from '../data/schema'

type SilkyKodhaOutwardDialogType = 'add' | 'edit' | 'delete' | 'delete-multi'

type SilkyKodhaOutwardContextType = {
    open: SilkyKodhaOutwardDialogType | null
    setOpen: (str: SilkyKodhaOutwardDialogType | null) => void
    currentRow: SilkyKodhaOutward | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<SilkyKodhaOutward | null>
    >
}

const SilkyKodhaOutwardContext =
    React.createContext<SilkyKodhaOutwardContextType | null>(null)

export function SilkyKodhaOutwardProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<SilkyKodhaOutwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<SilkyKodhaOutward | null>(null)

    return (
        <SilkyKodhaOutwardContext.Provider
            value={{ open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </SilkyKodhaOutwardContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const silkyKodhaOutward = () => {
    const context = React.useContext(SilkyKodhaOutwardContext)
    if (!context) {
        throw new Error(
            'silkyKodhaOutward has to be used within <SilkyKodhaOutwardContext>'
        )
    }
    return context
}
