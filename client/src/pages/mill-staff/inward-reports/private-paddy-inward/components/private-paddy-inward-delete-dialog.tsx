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
import { useDeletePrivatePaddyInward } from '../data/hooks'
import { type PrivatePaddyInward } from '../data/schema'
import { privatePaddyInward } from './private-paddy-inward-provider'

type PrivatePaddyInwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PrivatePaddyInward | null
}

export function PrivatePaddyInwardDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: PrivatePaddyInwardDeleteDialogProps) {
    const { millId } = privatePaddyInward()
    const deleteMutation = useDeletePrivatePaddyInward(millId)

    const handleDelete = () => {
        if (!currentRow?._id) return

        deleteMutation.mutate(currentRow._id, {
            onSuccess: () => {
                toast.success('Deleted successfully')
                onOpenChange(false)
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to delete')
            },
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
