import { BrokerReportActionDialog } from './broker-report-action-dialog'
import { BrokerReportDeleteDialog } from './broker-report-delete-dialog'
import { brokerReport } from './broker-report-provider'

export function BrokerReportDialogs() {
    const { open, setOpen, currentRow } = brokerReport()

    return (
        <>
            <BrokerReportActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <BrokerReportDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
