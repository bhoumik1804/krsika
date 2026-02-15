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
import { useDeleteLabourMilling } from '../data/hooks'
import { type LabourMilling } from '../data/schema'

// ... imports

type LabourMillingDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: LabourMilling | null
}

export function LabourMillingDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: LabourMillingDeleteDialogProps) {
    const { millId } = useParams<{ millId: string }>()
    const deleteMutation = useDeleteLabourMilling(millId || '')

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
