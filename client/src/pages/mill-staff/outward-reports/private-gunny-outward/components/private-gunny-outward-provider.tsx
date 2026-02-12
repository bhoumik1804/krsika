import { useState, createContext, useContext, ReactNode } from 'react'
import { PrivateGunnyOutward } from '../data/schema'

type PrivateGunnyOutwardDialogType = 'add' | 'edit' | 'delete' | 'delete-multi'

interface PrivateGunnyOutwardContextType {
    open: PrivateGunnyOutwardDialogType | null
    setOpen: (str: PrivateGunnyOutwardDialogType | null) => void
    currentRow: PrivateGunnyOutward | null
    setCurrentRow: (row: PrivateGunnyOutward | null) => void
    millId: string
}

const PrivateGunnyOutwardContext =
    createContext<PrivateGunnyOutwardContextType | null>(null)

interface PrivateGunnyOutwardProviderProps {
    children: ReactNode
    millId: string
}

export function PrivateGunnyOutwardProvider({
    children,
    millId,
}: PrivateGunnyOutwardProviderProps) {
    const [open, setOpen] = useState<PrivateGunnyOutwardDialogType | null>(null)
    const [currentRow, setCurrentRow] = useState<PrivateGunnyOutward | null>(
        null
    )

    return (
        <PrivateGunnyOutwardContext.Provider
            value={{ open, setOpen, currentRow, setCurrentRow, millId }}
        >
            {children}
        </PrivateGunnyOutwardContext.Provider>
    )
}

export const usePrivateGunnyOutward = () => {
    const context = useContext(PrivateGunnyOutwardContext)
    if (!context) {
        throw new Error(
            'usePrivateGunnyOutward must be used within a PrivateGunnyOutwardProvider'
        )
    }
    return context
}
