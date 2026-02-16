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
import { useDeleteBalanceLiftingPaddyPurchase } from '../data/hooks'
import { type BalanceLiftingPurchasesPaddy } from '../data/schema'
import { useBalanceLiftingPurchasesPaddy } from './balance-lifting-purchases-paddy-provider'

type BalanceLiftingPurchasesPaddyDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: BalanceLiftingPurchasesPaddy | null
}

export function BalanceLiftingPurchasesPaddyDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: BalanceLiftingPurchasesPaddyDeleteDialogProps) {
    const { millId } = useBalanceLiftingPurchasesPaddy()
    const { mutateAsync: deletePurchase, isPending: isDeleting } =
        useDeleteBalanceLiftingPaddyPurchase(millId)

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
