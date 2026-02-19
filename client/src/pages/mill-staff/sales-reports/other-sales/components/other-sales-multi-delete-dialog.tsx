import { type Table } from '@tanstack/react-table'
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
import { useBulkDeleteOtherSales } from '../data/hooks'

type OtherSalesMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OtherSalesMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: OtherSalesMultiDeleteDialogProps<TData>) {
    const { millId } = useParams<{ millId: string }>()
    const { mutate: bulkDelete, isPending } = useBulkDeleteOtherSales(
        millId || ''
    )
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = () => {
        const ids = selectedRows
            .map((row) => (row.original as any)._id)
            .filter(Boolean)
        if (ids.length === 0) return
        bulkDelete(ids, {
            onSuccess: () => {
                table.resetRowSelection()
                onOpenChange(false)
            },
        })
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
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
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
