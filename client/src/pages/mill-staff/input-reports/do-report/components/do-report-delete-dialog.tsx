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
import { useDeleteDoReport } from '../data/hooks'
import { type DoReportData } from '../data/schema'
import { useDoReport } from './do-report-provider'

type DoReportDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: DoReportData
}

export function DoReportDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: DoReportDeleteDialogProps) {
    const { millId } = useDoReport()
    const { mutate: deleteDoReport, isPending: isDeleting } = useDeleteDoReport(
        millId || ''
    )

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        if (currentRow._id) {
            deleteDoReport(currentRow._id, {
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
                        <strong>{currentRow.doNo}</strong>?
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
