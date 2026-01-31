import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type ProductionEntry } from '../data/schema'

type ProductionDialogType = 'add' | 'edit' | 'delete'

type ProductionContextType = {
    open: ProductionDialogType | null
    setOpen: (str: ProductionDialogType | null) => void
    currentRow: ProductionEntry | null
    setCurrentRow: React.Dispatch<React.SetStateAction<ProductionEntry | null>>
}

const ProductionContext = React.createContext<ProductionContextType | null>(
    null
)

export function ProductionProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<ProductionDialogType>(null)
    const [currentRow, setCurrentRow] = useState<ProductionEntry | null>(null)

    return (
        <ProductionContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </ProductionContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProduction = () => {
    const context = React.useContext(ProductionContext)

    if (!context) {
        throw new Error(
            'useProduction has to be used within <ProductionContext>'
        )
    }

    return context
}
