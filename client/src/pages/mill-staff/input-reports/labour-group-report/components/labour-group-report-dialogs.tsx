import { LabourGroupReportActionDialog } from './labour-group-report-action-dialog'
import { LabourGroupReportDeleteDialog } from './labour-group-report-delete-dialog'
import { labourGroupReport } from './labour-group-report-provider'

export function LabourGroupReportDialogs() {
    const { open, setOpen, currentRow } = labourGroupReport()

    return (
        <>
            <LabourGroupReportActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <LabourGroupReportDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
