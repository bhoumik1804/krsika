import { PartyReportActionDialog } from './party-report-action-dialog'
import { PartyReportDeleteDialog } from './party-report-delete-dialog'
import { partyReport } from './party-report-provider'

export function PartyReportDialogs() {
    const { open, setOpen, currentRow } = partyReport()

    return (
        <>
            <PartyReportActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <PartyReportDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
