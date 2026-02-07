import { TransporterReportActionDialog } from './transporter-report-action-dialog'
import { TransporterReportDeleteDialog } from './transporter-report-delete-dialog'
import { useTransporterReport } from './transporter-report-provider'

export function TransporterReportDialogs() {
    const { open, setOpen } = useTransporterReport()

    return (
        <>
            <TransporterReportActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
            />
            <TransporterReportDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
            />
        </>
    )
}
