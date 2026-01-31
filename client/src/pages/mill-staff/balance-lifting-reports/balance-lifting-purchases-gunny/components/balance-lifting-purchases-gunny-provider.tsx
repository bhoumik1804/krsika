import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type BalanceLiftingPurchasesGunny } from '../data/schema'

type GunnyDialogType = 'add' | 'edit' | 'delete'

type BalanceLiftingPurchasesGunnyContextType = {
    open: GunnyDialogType | null
    setOpen: (str: GunnyDialogType | null) => void
    currentRow: BalanceLiftingPurchasesGunny | null
    setCurrentRow: React.Dispatch<React.SetStateAction<BalanceLiftingPurchasesGunny | null>>
}

const BalanceLiftingPurchasesGunnyContext = React.createContext<BalanceLiftingPurchasesGunnyContextType | null>(null)

export function BalanceLiftingPurchasesGunnyProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<GunnyDialogType>(null)
    const [currentRow, setCurrentRow] = useState<BalanceLiftingPurchasesGunny | null>(null)

    return (
        <BalanceLiftingPurchasesGunnyContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </BalanceLiftingPurchasesGunnyContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const balanceLiftingPurchasesGunny = () => {
    const gunnContext = React.useContext(BalanceLiftingPurchasesGunnyContext)

    if (!gunnContext) {
        throw new Error('balanceLiftingPurchasesGunny has to be used within <BalanceLiftingPurchasesGunnyContext>')
    }

    return gunnContext
}
