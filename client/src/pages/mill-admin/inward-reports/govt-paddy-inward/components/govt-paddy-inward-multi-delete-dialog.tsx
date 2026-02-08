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
import { useBulkDeleteGovtPaddyInward } from '../data/hooks'
import { type GovtPaddyInward } from '../data/schema'
import { useGovtPaddyInward } from './govt-paddy-inward-provider'

type GovtPaddyInwardMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function GovtPaddyInwardMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: GovtPaddyInwardMultiDeleteDialogProps<TData>) {
    const { millId } = useGovtPaddyInward()
    const { mutateAsync: bulkDeleteGovtPaddyInward, isPending } =
        useBulkDeleteGovtPaddyInward(millId)

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        const ids = selectedRows
            .map((row) => (row.original as GovtPaddyInward)._id)
            .filter((id): id is string => !!id)

        if (ids.length === 0) return

        try {
            await bulkDeleteGovtPaddyInward(ids)
            table.resetRowSelection()
            onOpenChange(false)
        } catch (error) {
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
