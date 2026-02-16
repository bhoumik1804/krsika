import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteStaff } from '../data/hooks'
import { type StaffReportData } from '../data/schema'
import { useStaffReport } from './staff-report-provider'

type StaffReportDeleteDialogProps = {
    currentRow: StaffReportData
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function StaffReportDeleteDialog({
    currentRow,
    open,
    onOpenChange,
}: StaffReportDeleteDialogProps) {
    const { millId } = useStaffReport()
    const { mutate: deleteStaff, isPending: isDeleting } =
        useDeleteStaff(millId)

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        const staffId = currentRow._id
        if (staffId) {
            deleteStaff(staffId, {
                onSuccess: () => {
                    onOpenChange(false)
                },
            })
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Record?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this record for{' '}
                        <strong>{currentRow.fullName}</strong>?
                        <br />
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
