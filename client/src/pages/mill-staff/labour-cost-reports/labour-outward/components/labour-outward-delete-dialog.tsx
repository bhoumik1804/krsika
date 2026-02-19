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
import { useDeleteLabourOutward } from '../data/hooks'
import { type LabourOutward } from '../data/schema'

// ... imports

type LabourOutwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: LabourOutward | null
}

export function LabourOutwardDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: LabourOutwardDeleteDialogProps) {
    const { millId } = useParams<{ millId: string }>()
    const deleteMutation = useDeleteLabourOutward(millId || '')

    const handleDelete = () => {
        if (currentRow?._id) {
            deleteMutation.mutate(currentRow._id, {
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
                        <strong>{currentRow?.labourGroupName}</strong>?
                        <br />
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
