import { StaffActionDialog } from './staff-action-dialog'
import { StaffBulkAttendanceDialog } from './staff-bulk-attendance-dialog'
import { StaffDeleteDialog } from './staff-delete-dialog'
import { StaffMarkAttendanceDialog } from './staff-mark-attendance-dialog'
import { useStaff } from './staff-provider'
import { StaffViewAttendanceDialog } from './staff-view-attendance-dialog'

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

                    <StaffDeleteDialog
                        key={`staff-delete-${currentRow._id}`}
                        open={open === 'delete'}
                        onOpenChange={(isOpen) => {
                            if (!isOpen) {
                                setOpen(null)
                                setTimeout(() => {
                                    setCurrentRow(null)
                                }, 500)
                            }
                        }}
                        currentRow={currentRow}
                    />

                    <StaffMarkAttendanceDialog
                        key={`staff-attendance-${currentRow._id}`}
                    />

                    <StaffViewAttendanceDialog
                        key={`staff-view-attendance-${currentRow._id}`}
                        // open={open === 'view-attendance'}
                        // onOpenChange={() => {
                        //     setOpen('view-attendance')
                        //     setTimeout(() => {
                        //         setCurrentRow(null)
                        //     }, 500)
                        // }}
                        // currentRow={currentRow}
                    />

                    <StaffBulkAttendanceDialog
                        key={`staff-bulk-attendance-${currentRow._id}`}
                        // open={open === 'bulk-attendance'}
                        // onOpenChange={() => {
                        //     setOpen('bulk-attendance')
                        //     setTimeout(() => {
                        //         setCurrentRow(null)
                        //     }, 500)
                        // }}
                        // currentRow={currentRow}
                    />
                </>
            )}
        </>
    )
}
