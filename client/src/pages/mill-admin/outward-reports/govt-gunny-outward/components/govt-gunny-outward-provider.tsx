import { useState, createContext, useContext, ReactNode } from 'react'
import { GovtGunnyOutward } from '../data/schema'

type GovtGunnyOutwardDialogType = 'add' | 'edit' | 'delete' | 'delete-multi'

interface GovtGunnyOutwardContextType {
    open: GovtGunnyOutwardDialogType | null
    setOpen: (str: GovtGunnyOutwardDialogType | null) => void
    currentRow: GovtGunnyOutward | null
    setCurrentRow: (row: GovtGunnyOutward | null) => void
}

const GovtGunnyOutwardContext =
    createContext<GovtGunnyOutwardContextType | null>(null)

interface GovtGunnyOutwardProviderProps {
    children: ReactNode
}

export function GovtGunnyOutwardProvider({
    children,
}: GovtGunnyOutwardProviderProps) {
    const [open, setOpen] = useState<GovtGunnyOutwardDialogType | null>(null)
    const [currentRow, setCurrentRow] = useState<GovtGunnyOutward | null>(null)

    return (
        <GovtGunnyOutwardContext.Provider
            value={{ open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </GovtGunnyOutwardContext.Provider>
    )
}

export const useGovtGunnyOutwardContext = () => {
    const context = useContext(GovtGunnyOutwardContext)
    if (!context) {
        throw new Error(
            'useGovtGunnyOutwardContext must be used within a GovtGunnyOutwardProvider'
        )
    }
    return context
}
