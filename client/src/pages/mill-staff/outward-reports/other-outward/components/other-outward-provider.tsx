import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type OtherOutward } from '../data/schema'

type OtherOutwardDialogType = 'add' | 'edit' | 'delete'

type OtherOutwardContextType = {
    open: OtherOutwardDialogType | null
    setOpen: (str: OtherOutwardDialogType | null) => void
    currentRow: OtherOutward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<OtherOutward | null>>
}

const OtherOutwardContext = React.createContext<OtherOutwardContextType | null>(null)

export function OtherOutwardProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<OtherOutwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<OtherOutward | null>(null)

    return (
        <OtherOutwardContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </OtherOutwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const otherOutward = () => {
    const context = React.useContext(OtherOutwardContext)

    if (!context) {
        throw new Error('otherOutward has to be used within <OtherOutwardContext>')
    }

    return context
}
