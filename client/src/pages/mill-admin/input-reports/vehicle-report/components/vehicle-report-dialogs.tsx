import { VehicleReportActionDialog } from './vehicle-report-action-dialog'
import { VehicleReportDeleteDialog } from './vehicle-report-delete-dialog'
import { vehicleReport } from './vehicle-report-provider'

export function VehicleReportDialogs() {
    const { open, setOpen, currentRow } = vehicleReport()

    return (
        <>
            <VehicleReportActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
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
