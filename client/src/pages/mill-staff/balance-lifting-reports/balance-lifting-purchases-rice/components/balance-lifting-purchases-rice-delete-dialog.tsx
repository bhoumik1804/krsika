import { useDeleteRicePurchase } from '@/pages/mill-admin/purchase-reports/rice/data/hooks'
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
import { type BalanceLiftingPurchasesRice } from '../data/schema'

type BalanceLiftingPurchasesRiceDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: BalanceLiftingPurchasesRice | null
    millId: string
}

export function BalanceLiftingPurchasesRiceDeleteDialog({
    open,
    onOpenChange,
    currentRow,
    millId,
}: BalanceLiftingPurchasesRiceDeleteDialogProps) {
    const deleteMutation = useDeleteRicePurchase(millId)

    const handleDelete = async () => {
        if (!currentRow?._id) return
        try {
            await deleteMutation.mutateAsync(currentRow._id)
            onOpenChange(false)
        } catch {
            // Error handled by mutation onError
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
