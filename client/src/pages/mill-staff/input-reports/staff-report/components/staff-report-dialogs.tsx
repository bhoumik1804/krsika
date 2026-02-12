import { StaffReportActionDialog } from './staff-report-action-dialog'
import { StaffReportDeleteDialog } from './staff-report-delete-dialog'
import { staffReport } from './staff-report-provider'

export function StaffReportDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = staffReport()

    const handleDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            setCurrentRow(null)
        }
        setOpen(isOpen ? open : null)
    }

    return (
        <>
            <StaffReportActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={handleDialogChange}
                currentRow={currentRow}
            />
            <StaffReportDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
