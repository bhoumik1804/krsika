// purchase-deals-delete-dialog.tsx
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
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
import { type PurchaseDeal } from '../data/schema'

type PurchaseDealsDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PurchaseDeal | null
}

export function PurchaseDealsDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: PurchaseDealsDeleteDialogProps) {
    const handleDelete = () => {
        toast.promise(sleep(2000), {
            loading: 'Deleting deal...',
            success: () => {
                onOpenChange(false)
                return 'Deal deleted successfully'
            },
            error: 'Failed to delete deal',
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Deal?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this purchase deal for{' '}
                        <strong>{currentRow?.farmerName}</strong>?
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
