import { PartyReportActionDialog } from './party-report-action-dialog'
import { PartyReportDeleteDialog } from './party-report-delete-dialog'
import { usePartyReport } from './party-report-provider'

export function PartyReportDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = usePartyReport()

    return (
        <>
            <PartyReportActionDialog
                key='party-add'
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {currentRow && (
                <>
                    <PartyReportActionDialog
                        key={`party-edit-${currentRow._id}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />

                    <PartyReportDeleteDialog
                        key={`party-delete-${currentRow._id}`}
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />
                </>
            )}
        </>
    )
}
