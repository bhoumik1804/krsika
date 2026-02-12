import { useState, createContext, useContext, ReactNode } from 'react'
import { FrkOutward } from '../data/schema'

type FrkOutwardDialogType = 'add' | 'edit' | 'delete' | 'delete-multi'

interface FrkOutwardContextType {
    open: FrkOutwardDialogType | null
    setOpen: (str: FrkOutwardDialogType | null) => void
    currentRow: FrkOutward | null
    setCurrentRow: (row: FrkOutward | null) => void
    millId: string
}

const FrkOutwardContext = createContext<FrkOutwardContextType | null>(null)

interface FrkOutwardProviderProps {
    children: ReactNode
    millId: string
}

export function FrkOutwardProvider({
    children,
    millId,
}: FrkOutwardProviderProps) {
    const [open, setOpen] = useState<FrkOutwardDialogType | null>(null)
    const [currentRow, setCurrentRow] = useState<FrkOutward | null>(null)

    return (
        <FrkOutwardContext.Provider
            value={{ open, setOpen, currentRow, setCurrentRow, millId }}
        >
            {children}
        </FrkOutwardContext.Provider>
    )
}

export const useFrkOutward = () => {
    const context = useContext(FrkOutwardContext)
    if (!context) {
        throw new Error(
            'useFrkOutward must be used within a FrkOutwardProvider'
        )
    }
    return context
}
