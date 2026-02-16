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
import { useBulkDeleteRicePurchases } from '@/pages/mill-admin/purchase-reports/rice/data/hooks'
import { useBalanceLiftingPurchasesRice } from './balance-lifting-purchases-rice-provider'
import type { BalanceLiftingPurchasesRice } from '../data/schema'

type RiceMultiDeleteDialogProps = {
    table: Table<BalanceLiftingPurchasesRice>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function RiceMultiDeleteDialog({
    table,
    open,
    onOpenChange,
}: RiceMultiDeleteDialogProps) {
    const { millId } = useBalanceLiftingPurchasesRice()
    const { mutateAsync: bulkDelete, isPending } =
        useBulkDeleteRicePurchases(millId)

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        try {
            const ids = selectedRows
                .map((row) => (row.original as BalanceLiftingPurchasesRice)._id)
                .filter(Boolean) as string[]
            if (ids.length === 0) return
            await bulkDelete(ids)
            table.resetRowSelection()
            onOpenChange(false)
        } catch {
            // Error handled by mutation onError
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete {selectedRows.length} rice purchase record
                        {selectedRows.length > 1 ? 's' : ''}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the selected rice
                        purchase records? <br />
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteSelected}
                        disabled={isPending}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        {isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
