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
import { useDeleteRicePurchase } from '../data/hooks'
import { useRice } from './rice-provider'

type RiceDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function RiceDeleteDialog({
    open,
    onOpenChange,
}: RiceDeleteDialogProps) {
    const { currentRow, millId } = useRice()
    const { mutateAsync: deleteRicePurchase, isPending: isDeleting } =
        useDeleteRicePurchase(millId)

    const handleDelete = async () => {
        if (currentRow?._id) {
            try {
                await deleteRicePurchase(currentRow._id)
                onOpenChange(false)
            } catch (error) {
                console.error('Error deleting purchase:', error)
            }
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Rice Purchase?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the rice purchase from{' '}
                        <strong>{currentRow?.partyName}</strong> on{' '}
                        <strong>{currentRow?.date}</strong>? <br />
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
