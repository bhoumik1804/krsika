import { LabourGroupReportActionDialog } from './labour-group-report-action-dialog'
import { LabourGroupReportDeleteDialog } from './labour-group-report-delete-dialog'
import { labourGroupReport } from './labour-group-report-provider'

export function LabourGroupReportDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = labourGroupReport()

    const handleDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            setCurrentRow(null)
        }
        setOpen(isOpen ? open : null)
    }

    return (
        <>
            <LabourGroupReportActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={handleDialogChange}
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
