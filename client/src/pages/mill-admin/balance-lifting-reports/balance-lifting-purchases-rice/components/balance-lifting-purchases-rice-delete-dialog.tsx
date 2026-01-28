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
import { type BalanceLiftingPurchasesRice } from '../data/schema'

type BalanceLiftingPurchasesRiceDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: BalanceLiftingPurchasesRice | null
}

export function BalanceLiftingPurchasesRiceDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: BalanceLiftingPurchasesRiceDeleteDialogProps) {
    const handleDelete = () => {
        toast.promise(sleep(2000), {
            loading: 'Deleting rice purchase...',
            success: () => {
                onOpenChange(false)
                return 'Rice purchase deleted successfully'
            },
            error: 'Failed to delete purchase record',
        })
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
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
