import { VehicleReportActionDialog } from './vehicle-report-action-dialog'
import { VehicleReportDeleteDialog } from './vehicle-report-delete-dialog'
import { vehicleReport } from './vehicle-report-provider'

export function VehicleReportDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = vehicleReport()

    const handleDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            setCurrentRow(null)
        }
        setOpen(isOpen ? open : null)
    }

    return (
        <>
            <VehicleReportActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={handleDialogChange}
                currentRow={currentRow}
            />
            <VehicleReportDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
