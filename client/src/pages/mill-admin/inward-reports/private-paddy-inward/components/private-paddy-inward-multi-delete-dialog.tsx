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
import { useBulkDeletePrivatePaddyInward } from '../data/hooks'
import { privatePaddyInward } from './private-paddy-inward-provider'

type PrivatePaddyInwardMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PrivatePaddyInwardMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: PrivatePaddyInwardMultiDeleteDialogProps<TData>) {
    const { millId } = privatePaddyInward()
    const bulkDeleteMutation = useBulkDeletePrivatePaddyInward(millId)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = () => {
        const ids = selectedRows
            .map((row) => (row.original as { _id?: string })._id)
            .filter((id): id is string => !!id)

        if (!ids.length) return

        bulkDeleteMutation.mutate(ids, {
            onSuccess: () => {
                table.resetRowSelection()
                onOpenChange(false)
                toast.success(
                    `Deleted ${ids.length} record${ids.length > 1 ? 's' : ''}`
                )
            },
            onError: (error) => {
                toast.error(error.message || 'Error deleting records')
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
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
