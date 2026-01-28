import { StaffReportActionDialog } from './staff-report-action-dialog'
import { StaffReportDeleteDialog } from './staff-report-delete-dialog'
import { staffReport } from './staff-report-provider'

export function StaffReportDialogs() {
    const { open, setOpen, currentRow } = staffReport()

    return (
        <>
            <StaffReportActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
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
