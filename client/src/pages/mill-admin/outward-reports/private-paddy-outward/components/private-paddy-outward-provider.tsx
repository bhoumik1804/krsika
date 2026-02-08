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
    millId: string
}

const PrivatePaddyOutwardContext =
    React.createContext<PrivatePaddyOutwardContextType | null>(null)

export function PrivatePaddyOutwardProvider({
    children,
    millId,
}: {
    children: React.ReactNode
    millId: string
}) {
    const [open, setOpen] = useDialogState<PrivatePaddyOutwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PrivatePaddyOutward | null>(
        null
    )

    return (
        <PrivatePaddyOutwardContext
            value={{ open, setOpen, currentRow, setCurrentRow, millId }}
        >
            {children}
        </PrivatePaddyOutwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePrivatePaddyOutward = () => {
    const context = React.useContext(PrivatePaddyOutwardContext)

    if (!context) {
        throw new Error(
            'usePrivatePaddyOutward has to be used within <PrivatePaddyOutwardProvider>'
        )
    }

    return context
}
