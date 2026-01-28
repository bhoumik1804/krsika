import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type BhusaOutward } from '../data/schema'

type BhusaOutwardDialogType = 'add' | 'edit' | 'delete' | 'delete-multi'

type BhusaOutwardContextType = {
    open: BhusaOutwardDialogType | null
    setOpen: (str: BhusaOutwardDialogType | null) => void
    currentRow: BhusaOutward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<BhusaOutward | null>>
}

const BhusaOutwardContext = React.createContext<BhusaOutwardContextType | null>(
    null
)

export function BhusaOutwardProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<BhusaOutwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<BhusaOutward | null>(null)

    return (
        <BhusaOutwardContext.Provider
            value={{ open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </BhusaOutwardContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const bhusaOutward = () => {
    const context = React.useContext(BhusaOutwardContext)

    if (!context) {
        throw new Error(
            'bhusaOutward has to be used within <BhusaOutwardContext>'
        )
    }

    return context
}
