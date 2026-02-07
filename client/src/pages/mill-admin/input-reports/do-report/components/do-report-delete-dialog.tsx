import { useParams } from 'react-router'
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
import { doReport } from './do-report-provider'

type DoReportDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: DoReportData | null
}

export function DoReportDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: DoReportDeleteDialogProps) {
    const { setCurrentRow } = doReport()
    const { millId } = useParams<{ millId: string }>()
    const { mutate: deleteDoReport, isPending: isDeleting } = useDeleteDoReport(
        millId || ''
    )

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (currentRow?._id) {
            deleteDoReport(currentRow._id, {
                onSuccess: () => {
                    onOpenChange(false)
                    setCurrentRow(null)
                },
            })
        }
    }

    const handleDialogClose = (isOpen: boolean) => {
        if (!isOpen) {
            setCurrentRow(null)
        }
        onOpenChange(isOpen)
    }

    return (
        <AlertDialog open={open} onOpenChange={handleDialogClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Record?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this record for{' '}
                        <strong>{currentRow?.doNo}</strong> on <br />
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
