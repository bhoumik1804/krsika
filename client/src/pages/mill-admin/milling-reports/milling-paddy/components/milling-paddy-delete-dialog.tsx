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
import { useDeleteMillingPaddy } from '../data/hooks'
import { type MillingPaddy } from '../data/schema'

type MillingPaddyDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: MillingPaddy | null
}

export function MillingPaddyDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: MillingPaddyDeleteDialogProps) {
    const { millId } = useParams<{ millId: string }>()
    const deleteMutation = useDeleteMillingPaddy(millId || '')

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
                        <strong>{currentRow?.paddyType}</strong>?
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
