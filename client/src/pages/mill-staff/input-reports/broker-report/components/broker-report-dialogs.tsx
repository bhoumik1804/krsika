import { BrokerReportActionDialog } from './broker-report-action-dialog'
import { BrokerReportDeleteDialog } from './broker-report-delete-dialog'
import { useBrokerReport } from './broker-report-provider'

export function BrokerReportDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useBrokerReport()

    return (
        <>
            <BrokerReportActionDialog
                key='broker-add'
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />
            {currentRow && (
                <BrokerReportActionDialog
                    key={`broker-edit-${currentRow._id}`}
                    open={open === 'edit'}
                    onOpenChange={() => {
                        setOpen('edit')
                        setTimeout(() => {
                            setCurrentRow(null)
                        }, 500)
                    }}
                    currentRow={currentRow}
                />
            )}
            {currentRow && (
                <BrokerReportDeleteDialog
                    open={open === 'delete'}
                    onOpenChange={() => {
                        setOpen('delete')
                        setTimeout(() => {
                            setCurrentRow(null)
                        }, 500)
                    }}
                    currentRow={currentRow}
                />
            )}
        </>
    )
}
