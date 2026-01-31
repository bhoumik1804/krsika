import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type GovtRiceOutward } from '../data/schema'

type GovtRiceOutwardDialogType = 'add' | 'edit' | 'delete'

type GovtRiceOutwardContextType = {
    open: GovtRiceOutwardDialogType | null
    setOpen: (str: GovtRiceOutwardDialogType | null) => void
    currentRow: GovtRiceOutward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<GovtRiceOutward | null>>
}

const GovtRiceOutwardContext =
    React.createContext<GovtRiceOutwardContextType | null>(null)

export function GovtRiceOutwardProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<GovtRiceOutwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<GovtRiceOutward | null>(null)

    return (
        <GovtRiceOutwardContext
            value={{ open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </GovtRiceOutwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGovtRiceOutward = () => {
    const context = React.useContext(GovtRiceOutwardContext)

    if (!context) {
        throw new Error(
            'useGovtRiceOutward must be used within <GovtRiceOutwardProvider>'
        )
    }

    return context
}
