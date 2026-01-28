import { useState, createContext, useContext, ReactNode } from 'react'
import { PrivateGunnyOutward } from '../data/schema'

type PrivateGunnyOutwardDialogType = 'add' | 'edit' | 'delete' | 'delete-multi'

interface PrivateGunnyOutwardContextType {
    open: PrivateGunnyOutwardDialogType | null
    setOpen: (str: PrivateGunnyOutwardDialogType | null) => void
    currentRow: PrivateGunnyOutward | null
    setCurrentRow: (row: PrivateGunnyOutward | null) => void
}

const PrivateGunnyOutwardContext =
    createContext<PrivateGunnyOutwardContextType | null>(null)

interface PrivateGunnyOutwardProviderProps {
    children: ReactNode
}

export function PrivateGunnyOutwardProvider({
    children,
}: PrivateGunnyOutwardProviderProps) {
    const [open, setOpen] = useState<PrivateGunnyOutwardDialogType | null>(null)
    const [currentRow, setCurrentRow] = useState<PrivateGunnyOutward | null>(
        null
    )

    return (
        <PrivateGunnyOutwardContext.Provider
            value={{ open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </PrivateGunnyOutwardContext.Provider>
    )
}

export const usePrivateGunnyOutwardContext = () => {
    const context = useContext(PrivateGunnyOutwardContext)
    if (!context) {
        throw new Error(
            'usePrivateGunnyOutwardContext must be used within a PrivateGunnyOutwardProvider'
        )
    }
    return context
}
