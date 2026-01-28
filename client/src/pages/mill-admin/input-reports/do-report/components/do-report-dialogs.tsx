import { DoReportActionDialog } from './do-report-action-dialog'
import { DoReportDeleteDialog } from './do-report-delete-dialog'
import { doReport } from './do-report-provider'

export function DoReportDialogs() {
    const { open, setOpen, currentRow } = doReport()

    return (
        <>
            <DoReportActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <DoReportDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
