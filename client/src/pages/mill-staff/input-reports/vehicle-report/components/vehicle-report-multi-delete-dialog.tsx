import { type Table } from '@tanstack/react-table'
import { useUser } from '@/pages/landing/hooks/use-auth'
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
import { useBulkDeleteVehicle } from '../data/hooks'

type VehicleReportMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function VehicleReportMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: VehicleReportMultiDeleteDialogProps<TData>) {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const { user } = useUser()
    const millId = user?.millId as string
    const bulkDeleteMutation = useBulkDeleteVehicle(millId)

    const handleDeleteSelected = async () => {
        const ids = selectedRows
            .map((row) => (row.original as { _id?: string })._id)
            .filter((id): id is string => !!id)

        if (ids.length === 0) {
            return
        }

        try {
            await bulkDeleteMutation.mutateAsync(ids)
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
                    <AlertDialogCancel disabled={bulkDeleteMutation.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteSelected}
                        disabled={bulkDeleteMutation.isPending}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        {bulkDeleteMutation.isPending
                            ? 'Deleting...'
                            : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
