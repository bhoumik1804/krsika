import { CommitteeReportActionDialog } from './committee-report-action-dialog'
import { CommitteeReportDeleteDialog } from './committee-report-delete-dialog'
import { useCommitteeReport } from './committee-report-provider'

export function CommitteeReportDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useCommitteeReport()

    return (
        <>
            <CommitteeReportActionDialog
                key='committee-add'
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />
            {currentRow && (
                <CommitteeReportActionDialog
                    key={`committee-edit-${currentRow._id}`}
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
                <CommitteeReportDeleteDialog
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
