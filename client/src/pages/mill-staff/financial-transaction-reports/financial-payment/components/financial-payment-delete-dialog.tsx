import { useParams } from 'react-router'
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
import { useDeleteFinancialPayment } from '../data/hooks'
import { type FinancialPayment } from '../data/schema'

type FinancialPaymentDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: FinancialPayment | null
}

export function FinancialPaymentDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: FinancialPaymentDeleteDialogProps) {
    const { millId } = useParams<{ millId: string }>()
    const deleteMutation = useDeleteFinancialPayment()

    const handleDelete = () => {
        if (currentRow && currentRow._id) {
            deleteMutation.mutate(
                { millId: millId || '', id: currentRow._id },
                {
                    onSuccess: () => {
                        onOpenChange(false)
                    },
                }
            )
        }
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
