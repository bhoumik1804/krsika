import { type Table } from '@tanstack/react-table'
import { toast } from 'sonner'
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
import { useBulkDeleteBhusaOutward } from '../data/hooks'
import { type BhusaOutward } from '../data/schema'

type BhusaOutwardMultiDeleteDialogProps = {
    table: Table<BhusaOutward>
    open: boolean
    onOpenChange: (open: boolean) => void
    millId: string
}

export function BhusaOutwardMultiDeleteDialog({
    table,
    open,
    onOpenChange,
    millId,
}: BhusaOutwardMultiDeleteDialogProps) {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const bulkDeleteMutation = useBulkDeleteBhusaOutward(millId)

    const handleDeleteSelected = () => {
        const ids = selectedRows
            .map((row) => row.original._id)
            .filter((id): id is string => id !== undefined)
        if (ids.length === 0) return

        toast.promise(bulkDeleteMutation.mutateAsync(ids), {
            loading: 'Deleting...',
            success: () => {
                table.resetRowSelection()
                onOpenChange(false)
                return `Deleted ${selectedRows.length} record${selectedRows.length > 1 ? 's' : ''}`
            },
            error: 'Error deleting records',
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
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
