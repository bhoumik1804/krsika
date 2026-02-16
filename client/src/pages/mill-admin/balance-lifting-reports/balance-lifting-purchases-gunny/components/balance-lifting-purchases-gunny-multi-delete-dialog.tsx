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
import { useBulkDeleteGunnyPurchases } from '@/pages/mill-admin/purchase-reports/gunny/data/hooks'
import { useBalanceLiftingPurchasesGunny } from './balance-lifting-purchases-gunny-provider'
import type { BalanceLiftingPurchasesGunny } from '../data/schema'

type GunnyMultiDeleteDialogProps = {
    table: Table<BalanceLiftingPurchasesGunny>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function GunnyMultiDeleteDialog({
    table,
    open,
    onOpenChange,
}: GunnyMultiDeleteDialogProps) {
    const { millId } = useBalanceLiftingPurchasesGunny()
    const { mutateAsync: bulkDelete, isPending } =
        useBulkDeleteGunnyPurchases(millId)

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        try {
            const ids = selectedRows
                .map((row) => (row.original as BalanceLiftingPurchasesGunny)._id)
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
