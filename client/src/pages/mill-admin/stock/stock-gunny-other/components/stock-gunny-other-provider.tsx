import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type StockGunnyOther } from '../data/schema'

type StockGunnyOtherDialogType = 'add' | 'edit' | 'delete'

type StockGunnyOtherContextType = {
    open: StockGunnyOtherDialogType | null
    setOpen: (str: StockGunnyOtherDialogType | null) => void
    currentRow: StockGunnyOther | null
    setCurrentRow: React.Dispatch<React.SetStateAction<StockGunnyOther | null>>
}

const StockGunnyOtherContext = React.createContext<StockGunnyOtherContextType | null>(null)

export function StockGunnyOtherProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<StockGunnyOtherDialogType>(null)
    const [currentRow, setCurrentRow] = useState<StockGunnyOther | null>(null)

    return (
        <StockGunnyOtherContext value={ { open, setOpen, currentRow, setCurrentRow } }>
            {children}
        </StockGunnyOtherContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const stockGunnyOther = () => {
    const context = React.useContext(StockGunnyOtherContext)

    if (!context) {
        throw new Error('stockGunnyOther has to be used within <StockGunnyOtherContext>')
    }

    return context
}
