import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type RiceInward } from '../data/schema'

type RiceInwardDialogType = 'add' | 'edit' | 'delete'

type RiceInwardContextType = {
    open: RiceInwardDialogType | null
    setOpen: (str: RiceInwardDialogType | null) => void
    currentRow: RiceInward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<RiceInward | null>>
}

const RiceInwardContext = React.createContext<RiceInwardContextType | null>(null)

export function RiceInwardProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<RiceInwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<RiceInward | null>(null)

    return (
        <RiceInwardContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </RiceInwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const riceInward = () => {
    const context = React.useContext(RiceInwardContext)

    if (!context) {
        throw new Error('riceInward has to be used within <RiceInwardContext>')
    }

    return context
}
