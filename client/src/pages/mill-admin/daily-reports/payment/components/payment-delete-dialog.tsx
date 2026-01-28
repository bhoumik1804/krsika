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
import { type PaymentEntry } from '../data/schema'

type PaymentDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PaymentEntry | null
}

export function PaymentDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: PaymentDeleteDialogProps) {
    const handleDelete = () => {
        toast.promise(sleep(2000), {
            loading: 'Deleting payment record...',
            success: () => {
                onOpenChange(false)
                return 'Payment record deleted successfully'
            },
            error: 'Failed to delete record',
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Payment record?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the payment record for{' '}
                        <strong>{currentRow?.partyName}</strong> (Voucher:{' '}
                        <strong>{currentRow?.voucherNumber}</strong>)?
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
