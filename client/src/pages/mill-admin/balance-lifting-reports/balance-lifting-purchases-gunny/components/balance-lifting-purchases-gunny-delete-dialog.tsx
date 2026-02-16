import { useDeleteGunnyPurchase } from '@/pages/mill-admin/purchase-reports/gunny/data/hooks'
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
import { type BalanceLiftingPurchasesGunny } from '../data/schema'

type BalanceLiftingPurchasesGunnyDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: BalanceLiftingPurchasesGunny | null
    millId: string
}

export function BalanceLiftingPurchasesGunnyDeleteDialog({
    open,
    onOpenChange,
    currentRow,
    millId,
}: BalanceLiftingPurchasesGunnyDeleteDialogProps) {
    const deleteMutation = useDeleteGunnyPurchase(millId)

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
                    <AlertDialogTitle>Delete Purchase?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this purchase record for{' '}
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
