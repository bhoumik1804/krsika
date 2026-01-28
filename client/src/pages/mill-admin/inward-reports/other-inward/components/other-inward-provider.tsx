import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type OtherInward } from '../data/schema'

type OtherInwardDialogType = 'add' | 'edit' | 'delete'

type OtherInwardContextType = {
    open: OtherInwardDialogType | null
    setOpen: (str: OtherInwardDialogType | null) => void
    currentRow: OtherInward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<OtherInward | null>>
}

const OtherInwardContext = React.createContext<OtherInwardContextType | null>(
    null
)

export function OtherInwardProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<OtherInwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<OtherInward | null>(null)

    return (
        <OtherInwardContext
            value={{ open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </OtherInwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOtherInward = () => {
    const context = React.useContext(OtherInwardContext)

    if (!context) {
        throw new Error(
            'useOtherInward has to be used within <OtherInwardContext>'
        )
    }

    return context
}
