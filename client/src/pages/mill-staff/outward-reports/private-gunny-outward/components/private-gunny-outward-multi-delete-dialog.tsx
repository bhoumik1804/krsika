import { Table } from '@tanstack/react-table'
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
import { usePrivateGunnyOutward } from './private-gunny-outward-provider'
import { useBulkDeletePrivateGunnyOutward } from '../data/hooks'
import { PrivateGunnyOutward } from '../data/schema'

interface Props<TData> {
    open: boolean
    onOpenChange: (open: boolean) => void
    table: Table<TData>
}

export function PrivateGunnyOutwardMultiDeleteDialog<TData>({
    open,
    onOpenChange,
    table,
}: Props<TData>) {
    const { millId } = usePrivateGunnyOutward()
    const bulkDeleteMutation = useBulkDeletePrivateGunnyOutward(millId)

    const handleBulkDelete = async () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows
        const ids = selectedRows.map(
            (row) => (row.original as PrivateGunnyOutward)._id
        )

        try {
            await bulkDeleteMutation.mutateAsync(ids)
            table.resetRowSelection()
            onOpenChange(false)
        } catch (error) {
            // Error handling is done in the mutation hook
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete {table.getFilteredSelectedRowModel().rows.length}{' '}
                        selected record(s).
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={bulkDeleteMutation.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                        onClick={handleBulkDelete}
                        disabled={bulkDeleteMutation.isPending}
                    >
                        {bulkDeleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
