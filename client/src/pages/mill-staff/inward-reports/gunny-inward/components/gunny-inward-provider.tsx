import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type GunnyInward } from '../data/schema'

type GunnyInwardDialogType = 'add' | 'edit' | 'delete'

type GunnyInwardContextType = {
    open: GunnyInwardDialogType | null
    setOpen: (str: GunnyInwardDialogType | null) => void
    currentRow: GunnyInward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<GunnyInward | null>>
}

const GunnyInwardContext = React.createContext<GunnyInwardContextType | null>(null)

export function GunnyInwardProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<GunnyInwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<GunnyInward | null>(null)

    return (
        <GunnyInwardContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </GunnyInwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const gunnyInward = () => {
    const context = React.useContext(GunnyInwardContext)

    if (!context) {
        throw new Error('gunnyInward has to be used within <GunnyInwardContext>')
    }

    return context
}
