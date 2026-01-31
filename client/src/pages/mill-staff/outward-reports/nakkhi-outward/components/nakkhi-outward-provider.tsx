import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type NakkhiOutward } from '../data/schema'

type NakkhiOutwardDialogType = 'add' | 'edit' | 'delete'

type NakkhiOutwardContextType = {
    open: NakkhiOutwardDialogType | null
    setOpen: (str: NakkhiOutwardDialogType | null) => void
    currentRow: NakkhiOutward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<NakkhiOutward | null>>
}

const NakkhiOutwardContext = React.createContext<NakkhiOutwardContextType | null>(null)

export function NakkhiOutwardProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<NakkhiOutwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<NakkhiOutward | null>(null)

    return (
        <NakkhiOutwardContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </NakkhiOutwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const nakkhiOutward = () => {
    const context = React.useContext(NakkhiOutwardContext)

    if (!context) {
        throw new Error('nakkhiOutward has to be used within <NakkhiOutwardContext>')
    }

    return context
}
