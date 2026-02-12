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
import { useDeleteOtherPurchase } from '../data/hooks'
import { type OtherPurchase } from '../data/schema'
import { useOther } from './other-provider'

type OtherDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: OtherPurchase | null
}

export function OtherDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: OtherDeleteDialogProps) {
    const { millId } = useOther()
    const { mutateAsync: deleteOtherPurchase, isPending: isDeleting } =
        useDeleteOtherPurchase(millId)

    const handleDelete = async () => {
        if (currentRow?._id) {
            try {
                await deleteOtherPurchase(currentRow._id)
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
                    <AlertDialogTitle>Delete Purchase?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this purchase record for{' '}
                        <strong>{currentRow?.partyName}</strong>?
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
