import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type GunnyPurchase } from '../data/schema'

type GunnyDialogType = 'add' | 'edit' | 'delete'

type GunnyContextType = {
    open: GunnyDialogType | null
    setOpen: (str: GunnyDialogType | null) => void
    currentRow: GunnyPurchase | null
    setCurrentRow: React.Dispatch<React.SetStateAction<GunnyPurchase | null>>
}

const GunnyContext = React.createContext<GunnyContextType | null>(null)

export function GunnyProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<GunnyDialogType>(null)
    const [currentRow, setCurrentRow] = useState<GunnyPurchase | null>(null)

    return (
        <GunnyContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </GunnyContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGunny = () => {
    const gunnContext = React.useContext(GunnyContext)

    if (!gunnContext) {
        throw new Error('useGunny has to be used within <GunnyContext>')
    }

    return gunnContext
}
