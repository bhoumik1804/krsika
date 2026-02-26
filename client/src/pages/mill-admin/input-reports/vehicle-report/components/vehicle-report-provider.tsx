import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type VehicleReportData } from '../data/schema'

type VehicleReportDialogType = 'add' | 'edit' | 'delete'

type VehicleReportContextType = {
    millId: string
    open: VehicleReportDialogType | null
    setOpen: (str: VehicleReportDialogType | null) => void
    currentRow: VehicleReportData | null
    setCurrentRow: React.Dispatch<
        React.SetStateAction<VehicleReportData | null>
    >
}

const VehicleReportContext =
    React.createContext<VehicleReportContextType | null>(null)

interface VehicleReportProviderProps {
    millId: string
    children: React.ReactNode
}

export function VehicleReportProvider({
    millId,
    children,
}: VehicleReportProviderProps) {
    const [open, setOpen] = useDialogState<VehicleReportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<VehicleReportData | null>(null)

    return (
        <VehicleReportContext
            value={{ millId, open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </VehicleReportContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useVehicleReport = () => {
    const context = React.useContext(VehicleReportContext)

    if (!context) {
        throw new Error(
            'useVehicleReport has to be used within <VehicleReportProvider>'
        )
    }

    return context
}
