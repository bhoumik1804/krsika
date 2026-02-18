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
import { useBulkDeleteSilkyKodhaOutward } from '../data/hooks'
import { type SilkyKodhaOutward } from '../data/schema'
import { silkyKodhaOutward } from './silky-kodha-outward-provider'

type SilkyKodhaOutwardMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SilkyKodhaOutwardMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: SilkyKodhaOutwardMultiDeleteDialogProps<TData>) {
    const { millId } = silkyKodhaOutward()
    const bulkDeleteMutation = useBulkDeleteSilkyKodhaOutward(millId)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = () => {
        const ids = selectedRows
            .map((row) => (row.original as SilkyKodhaOutward)._id)
            .filter((id): id is string => !!id)

        if (ids.length === 0) return

        bulkDeleteMutation.mutate(ids, {
            onSuccess: () => {
                toast.success(
                    `Deleted ${ids.length} record${ids.length > 1 ? 's' : ''}`
                )
                table.resetRowSelection()
                onOpenChange(false)
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
