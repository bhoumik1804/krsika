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
import { useDeleteFinancialReceipt } from '../data/hooks'
import { type FinancialReceipt } from '../data/schema'

type FinancialReceiptDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: FinancialReceipt | null
}

export function FinancialReceiptDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: FinancialReceiptDeleteDialogProps) {
    const { millId } = useParams<{ millId: string }>()
    const deleteMutation = useDeleteFinancialReceipt()

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
