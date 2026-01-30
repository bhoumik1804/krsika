import { StaffActionDialog } from './staff-action-dialog'
import { StaffDeleteDialog } from './staff-delete-dialog'
import { StaffMarkAttendanceDialog } from './staff-mark-attendance-dialog'
import { useStaff } from './staff-provider'

export function StaffDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useStaff()
    return (
        <>
            <StaffActionDialog
                key='staff-add'
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {currentRow && (
                <>
                    <StaffActionDialog
                        key={`staff-edit-${currentRow.id}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />

                    <StaffDeleteDialog
                        key={`staff-delete-${currentRow.id}`}
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />

                    <StaffMarkAttendanceDialog
                        key={`staff-attendance-${currentRow.id}`}
                    />
                </>
            )}
        </>
    )
}
