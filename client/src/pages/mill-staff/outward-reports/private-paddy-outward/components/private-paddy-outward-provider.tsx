import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type PrivatePaddyOutward } from '../data/schema'

type PrivatePaddyOutwardDialogType = 'add' | 'edit' | 'delete'

type PrivatePaddyOutwardContextType = {
    open: PrivatePaddyOutwardDialogType | null
    setOpen: (str: PrivatePaddyOutwardDialogType | null) => void
    currentRow: PrivatePaddyOutward | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<PrivatePaddyOutward | null>
    >
}

const PrivatePaddyOutwardContext =
    React.createContext<PrivatePaddyOutwardContextType | null>(null)

export function PrivatePaddyOutwardProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<PrivatePaddyOutwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PrivatePaddyOutward | null>(
        null
    )

    return (
        <PrivatePaddyOutwardContext
            value={{ open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </PrivatePaddyOutwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const privatePaddyOutward = () => {
    const context = React.useContext(PrivatePaddyOutwardContext)

    if (!context) {
        throw new Error(
            'privatePaddyOutward has to be used within <PrivatePaddyOutwardContext>'
        )
    }

    return context
}
