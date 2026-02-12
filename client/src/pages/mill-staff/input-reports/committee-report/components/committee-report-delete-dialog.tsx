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
import { useDeleteCommittee } from '../data/hooks'
import { type CommitteeReportData } from '../data/schema'
import { useCommitteeReport } from './committee-report-provider'

type CommitteeReportDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: CommitteeReportData | null
}

export function CommitteeReportDeleteDialog({
    open,
    onOpenChange,
}: CommitteeReportDeleteDialogProps) {
    const { currentRow, millId, setCurrentRow } = useCommitteeReport()
    const { mutate: deleteCommittee, isPending: isDeleting } =
        useDeleteCommittee(millId)

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (currentRow?._id) {
            deleteCommittee(currentRow._id, {
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
                        <strong>{currentRow?.committeeName}</strong>?
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
