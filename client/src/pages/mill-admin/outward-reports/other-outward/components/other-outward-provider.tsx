import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type OtherOutward } from '../data/schema'
import { type OtherOutwardListResponse } from '../data/types'

type OtherOutwardDialogType = 'add' | 'edit' | 'delete'

type OtherOutwardContextType = {
    open: OtherOutwardDialogType | null
    setOpen: (str: OtherOutwardDialogType | null) => void
    currentRow: OtherOutward | null
    setCurrentRow: React.Dispatch<React.SetStateAction<OtherOutward | null>>
    millId: string
    apiData: OtherOutwardListResponse | undefined
}

const OtherOutwardContext = React.createContext<OtherOutwardContextType | null>(
    null
)

type OtherOutwardProviderProps = {
    children: React.ReactNode
    millId: string
    apiData: OtherOutwardListResponse | undefined
}

export function OtherOutwardProvider({
    children,
    millId,
    apiData,
}: OtherOutwardProviderProps) {
    const [open, setOpen] = useDialogState<OtherOutwardDialogType>(null)
    const [currentRow, setCurrentRow] = useState<OtherOutward | null>(null)

    return (
        <OtherOutwardContext
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                millId,
                apiData,
            }}
        >
            {children}
        </OtherOutwardContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const otherOutward = () => {
    const context = React.useContext(OtherOutwardContext)

    if (!context) {
        throw new Error(
            'otherOutward has to be used within <OtherOutwardContext>'
        )
    }

    return context
}
