import { type Table } from '@tanstack/react-table'
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
import { useBulkDeleteBalanceLiftingFrkPurchases } from '../data/hooks'
import { type BalanceLiftingPurchasesFrk } from '../data/schema'
import { useBalanceLiftingPurchasesFrk } from './balance-lifting-purchases-frk-provider'

type FrkMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function FrkMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: FrkMultiDeleteDialogProps<TData>) {
    const { millId } = useBalanceLiftingPurchasesFrk()
    const { mutateAsync: bulkDelete, isPending: isDeleting } =
        useBulkDeleteBalanceLiftingFrkPurchases(millId)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        const purchaseIds = selectedRows
            .map((row) => (row.original as BalanceLiftingPurchasesFrk)._id)
            .filter(Boolean) as string[]

        if (purchaseIds.length > 0) {
            try {
                await bulkDelete(purchaseIds)
                table.resetRowSelection()
                onOpenChange(false)
            } catch (error) {
                console.error('Error deleting purchases:', error)
            }
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete {selectedRows.length}{' '}
                        {selectedRows.length > 1 ? 'purchases' : 'purchase'}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the selected purchases?{' '}
                        <br />
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteSelected}
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
