import { StaffReportActionDialog } from './staff-report-action-dialog'
import { StaffReportDeleteDialog } from './staff-report-delete-dialog'
import { useStaffReport } from './staff-report-provider'

export function StaffReportDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useStaffReport()

    return (
        <>
            <StaffReportActionDialog
                key='staff-add'
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {currentRow && (
                <>
                    <StaffReportActionDialog
                        key={`staff-edit-${currentRow._id}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />

                    <StaffReportDeleteDialog
                        key={`staff-delete-${currentRow._id}`}
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
