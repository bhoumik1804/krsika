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
import { useDeleteBulkPaddySales } from '../data/hooks'
import { type PaddySalesResponse } from '../data/types'

type PaddySalesMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PaddySalesMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: PaddySalesMultiDeleteDialogProps<TData>) {
    const { mutateAsync: bulkDelete, isPending: isDeleting } =
        useDeleteBulkPaddySales()
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        const saleIds = selectedRows
            .map((row) => (row.original as PaddySalesResponse)._id)
            .filter(Boolean) as string[]

        if (saleIds.length > 0) {
            try {
                await bulkDelete(saleIds)
                table.resetRowSelection()
                onOpenChange(false)
            } catch (error) {
                console.error('Error deleting sales:', error)
            }
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete {selectedRows.length}{' '}
                        {selectedRows.length > 1 ? 'sales' : 'sale'}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the selected sales?{' '}
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
