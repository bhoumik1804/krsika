import { TransporterReportActionDialog } from './transporter-report-action-dialog'
import { TransporterReportDeleteDialog } from './transporter-report-delete-dialog'
import { transporterReport } from './transporter-report-provider'

export function TransporterReportDialogs() {
    const { open, setOpen, currentRow } = transporterReport()

    return (
        <>
            <TransporterReportActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <TransporterReportDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
