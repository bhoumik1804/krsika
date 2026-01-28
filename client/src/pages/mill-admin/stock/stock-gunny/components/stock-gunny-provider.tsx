import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type StockGunny } from '../data/schema'

type StockGunnyDialogType = 'add' | 'edit' | 'delete'

type StockGunnyContextType = {
    open: StockGunnyDialogType | null
    setOpen: (str: StockGunnyDialogType | null) => void
    currentRow: StockGunny | null
    setCurrentRow: React.Dispatch<React.SetStateAction<StockGunny | null>>
}

const StockGunnyContext = React.createContext<StockGunnyContextType | null>(null)

export function StockGunnyProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<StockGunnyDialogType>(null)
    const [currentRow, setCurrentRow] = useState<StockGunny | null>(null)

    return (
        <StockGunnyContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </StockGunnyContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const stockGunnyOther = () => {
    const context = React.useContext(StockGunnyContext)

    if (!context) {
        throw new Error('stockGunnyOther has to be used within <StockGunnyContext>')
    }

    return context
}
