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
import { useBulkDeleteRiceSales } from '../data/hooks'
import { type RiceSales } from '../data/schema'
import { useRiceSales } from './rice-sales-provider'

type RiceSalesMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function RiceSalesMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: RiceSalesMultiDeleteDialogProps<TData>) {
    const { millId } = useRiceSales()
    const { mutateAsync: bulkDeleteRiceSales, isPending: isDeleting } =
        useBulkDeleteRiceSales(millId)

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        const ids = selectedRows
            .map((row) => (row.original as RiceSales)._id)
            .filter((id): id is string => !!id)

        if (ids.length > 0) {
            try {
                await bulkDeleteRiceSales(ids)
                table.resetRowSelection()
                onOpenChange(false)
            } catch (error) {
                console.error('Error deleting records:', error)
            }
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete {selectedRows.length}{' '}
                        {selectedRows.length > 1 ? 'records' : 'record'}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the selected records?{' '}
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
