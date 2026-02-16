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
import { useBulkDeleteBalanceLiftingPaddyPurchases } from '../data/hooks'
import { type BalanceLiftingPurchasesPaddy } from '../data/schema'
import { useBalanceLiftingPurchasesPaddy } from './balance-lifting-purchases-paddy-provider'

type PaddyMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PaddyMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: PaddyMultiDeleteDialogProps<TData>) {
    const { millId } = useBalanceLiftingPurchasesPaddy()
    const { mutateAsync: bulkDelete, isPending: isDeleting } =
        useBulkDeleteBalanceLiftingPaddyPurchases(millId)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        const purchaseIds = selectedRows
            .map((row) => (row.original as BalanceLiftingPurchasesPaddy)._id)
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
