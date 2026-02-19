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
import { useBulkDeletePrivateRiceOutward } from '../data/hooks'
import { type PrivateRiceOutward } from '../data/schema'
import { usePrivateRiceOutward } from './private-rice-outward-provider'

type PrivateRiceOutwardMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PrivateRiceOutwardMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: PrivateRiceOutwardMultiDeleteDialogProps<TData>) {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const { millId } = usePrivateRiceOutward()
    const bulkDeleteMutation = useBulkDeletePrivateRiceOutward(millId)

    const handleDeleteSelected = async () => {
        const ids = selectedRows
            .map((row) => (row.original as PrivateRiceOutward)._id)
            .filter((id): id is string => !!id)
        if (!ids.length) return

        try {
            await bulkDeleteMutation.mutateAsync(ids)
            table.resetRowSelection()
            onOpenChange(false)
        } catch {
            // Error is handled by mutation hook
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
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteSelected}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
