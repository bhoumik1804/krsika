import { CommitteeReportActionDialog } from './committee-report-action-dialog'
import { CommitteeReportDeleteDialog } from './committee-report-delete-dialog'
import { committeeReport } from './committee-report-provider'

export function CommitteeReportDialogs() {
    const { open, setOpen, currentRow } = committeeReport()

    return (
        <>
            <CommitteeReportActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <CommitteeReportDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
