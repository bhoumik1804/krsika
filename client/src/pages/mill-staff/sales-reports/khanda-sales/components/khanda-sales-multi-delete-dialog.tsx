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
import { useBulkDeleteKhandaSales } from '../data/hooks'
import type { KhandaSalesResponse } from '../data/types'
import { useKhandaSales } from './khanda-sales-provider'

type KhandaSalesMultiDeleteDialogProps = {
    table: Table<KhandaSalesResponse>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function KhandaSalesMultiDeleteDialog({
    table,
    open,
    onOpenChange,
}: KhandaSalesMultiDeleteDialogProps) {
    const { millId } = useKhandaSales()
    const { mutateAsync: bulkDeleteKhandaSales, isPending } =
        useBulkDeleteKhandaSales(millId)

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        const ids = selectedRows.map((row) => row.original._id)
        try {
            await bulkDeleteKhandaSales(ids)
            table.resetRowSelection()
            onOpenChange(false)
        } catch (error) {
            // Error handling is managed by mutation hook
            console.error('Bulk delete error:', error)
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
                    <AlertDialogCancel disabled={isPending}>
                        Cancel
                    </AlertDialogCancel>
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
