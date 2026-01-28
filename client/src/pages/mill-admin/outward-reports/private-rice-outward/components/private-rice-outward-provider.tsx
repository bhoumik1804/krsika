import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type PrivateRiceOutward } from '../data/schema'

type PrivateRiceOutwardDialogType = 'add' | 'edit' | 'delete'

type PrivateRiceOutwardContextType = {
    open: PrivateRiceOutwardDialogType | null
    setOpen: (str: PrivateRiceOutwardDialogType | null) => void
    currentRow: PrivateRiceOutward | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<PrivateRiceOutward | null>
    >
}

const PrivateRiceOutwardContext =
    React.createContext<PrivateRiceOutwardContextType | null>(null)

export function PrivateRiceOutwardProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<PrivateRiceOutwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PrivateRiceOutward | null>(
        null
    )

    return (
        <PrivateRiceOutwardContext
            value={{ open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </PrivateRiceOutwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePrivateRiceOutward = () => {
    const context = React.useContext(PrivateRiceOutwardContext)

    if (!context) {
        throw new Error(
            'usePrivateRiceOutward has to be used within <PrivateRiceOutwardContext>'
        )
    }

    return context
}
