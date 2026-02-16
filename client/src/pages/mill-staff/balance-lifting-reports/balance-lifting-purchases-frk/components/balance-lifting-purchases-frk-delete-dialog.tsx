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
import { useDeleteBalanceLiftingFrkPurchase } from '../data/hooks'
import { type BalanceLiftingPurchasesFrk } from '../data/schema'
import { useBalanceLiftingPurchasesFrk } from './balance-lifting-purchases-frk-provider'

type BalanceLiftingPurchasesFrkDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: BalanceLiftingPurchasesFrk | null
}

export function BalanceLiftingPurchasesFrkDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: BalanceLiftingPurchasesFrkDeleteDialogProps) {
    const { millId } = useBalanceLiftingPurchasesFrk()
    const { mutateAsync: deletePurchase, isPending: isDeleting } =
        useDeleteBalanceLiftingFrkPurchase(millId)

    const handleDelete = async () => {
        if (currentRow?._id) {
            try {
                await deletePurchase(currentRow._id)
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
