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
import { useDeleteLabourGroup } from '../data/hooks'
import { type LabourGroupReportData } from '../data/schema'

type LabourGroupReportDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: LabourGroupReportData | null
}

export function LabourGroupReportDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: LabourGroupReportDeleteDialogProps) {
    const { millId } = useParams<{ millId: string }>()
    const mutation = useDeleteLabourGroup(millId || '')

    const handleDelete = async () => {
        if (!currentRow?._id) return

        try {
            await mutation.mutateAsync(currentRow._id)
            onOpenChange(false)
        } catch (error) {
            // Error handling is managed by the mutation hook
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Record?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this record for{' '}
                        <strong>{currentRow?.labourTeamName}</strong>?
                        <br />
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={mutation.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDelete()
                        }}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
