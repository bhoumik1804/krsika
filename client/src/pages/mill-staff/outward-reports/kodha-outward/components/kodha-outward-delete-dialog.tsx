import { toast } from 'sonner'
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
import { useDeleteKodhaOutward } from '../data/hooks'
import { type KodhaOutward } from '../data/schema'

type KodhaOutwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: KodhaOutward | null
    millId: string
}

export function KodhaOutwardDeleteDialog({
    open,
    onOpenChange,
    currentRow,
    millId,
}: KodhaOutwardDeleteDialogProps) {
    const deleteMutation = useDeleteKodhaOutward(millId)

    const handleDelete = () => {
        if (!currentRow?._id) return
        toast.promise(deleteMutation.mutateAsync(currentRow._id), {
            loading: 'Deleting...',
            success: () => {
                onOpenChange(false)
                return 'Deleted successfully'
            },
            error: 'Failed to delete',
        })
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
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
