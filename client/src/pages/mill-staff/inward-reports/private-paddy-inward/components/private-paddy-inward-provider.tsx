import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type PrivatePaddyInward } from '../data/schema'

type PrivatePaddyInwardDialogType = 'add' | 'edit' | 'delete'

type PrivatePaddyInwardContextType = {
    millId: string
    open: PrivatePaddyInwardDialogType | null
    setOpen: (str: PrivatePaddyInwardDialogType | null) => void
    currentRow: PrivatePaddyInward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<PrivatePaddyInward | null>>
}

const PrivatePaddyInwardContext = React.createContext<PrivatePaddyInwardContextType | null>(null)

export function PrivatePaddyInwardProvider({
    millId,
    children,
}: {
    millId: string
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<PrivatePaddyInwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PrivatePaddyInward | null>(null)

    return (
        <PrivatePaddyInwardContext
            value={{ millId, open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </PrivatePaddyInwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const privatePaddyInward = () => {
    const context = React.useContext(PrivatePaddyInwardContext)

    if (!context) {
        throw new Error('privatePaddyInward has to be used within <PrivatePaddyInwardContext>')
    }

    return context
}
