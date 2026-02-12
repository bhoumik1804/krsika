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
import { useDeleteRiceInward } from '../data/hooks'
import { type RiceInward } from '../data/schema'
import { riceInward } from './rice-inward-provider'

type RiceInwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: RiceInward | null
}

export function RiceInwardDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: RiceInwardDeleteDialogProps) {
    const { millId } = riceInward()
    const deleteMutation = useDeleteRiceInward(millId)

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
