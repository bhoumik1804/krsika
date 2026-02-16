import { DoReportActionDialog } from './do-report-action-dialog'
import { DoReportDeleteDialog } from './do-report-delete-dialog'
import { useDoReport } from './do-report-provider'

export function DoReportDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useDoReport()

    return (
        <>
            <DoReportActionDialog
                key='do-report-add'
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />
            {currentRow && (
                <DoReportActionDialog
                    key={`do-report-edit-${currentRow._id}`}
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
                <DoReportDeleteDialog
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
