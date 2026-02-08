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
import { useDeleteFrkOutward } from '../data/hooks'
import { useFrkOutward } from './frk-outward-provider'

type FrkOutwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function FrkOutwardDeleteDialog({
    open,
    onOpenChange,
}: FrkOutwardDeleteDialogProps) {
    const { millId, currentRow } = useFrkOutward()
    const deleteMutation = useDeleteFrkOutward()

    const handleDelete = async () => {
        if (!currentRow) return
        try {
            await deleteMutation.mutateAsync({
                millId,
                id: currentRow._id,
            })
            onOpenChange(false)
        } catch (error) {
            // Error is handled by the mutation hook
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Record?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this record for{' '}
                        <strong>{currentRow?.partyName}</strong>?
                        <br />
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
