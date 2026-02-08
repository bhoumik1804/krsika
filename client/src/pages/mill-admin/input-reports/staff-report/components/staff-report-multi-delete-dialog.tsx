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
import { useBulkDeleteStaff } from '../data/hooks'
import { type StaffReportData } from '../data/schema'

type StaffReportMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function StaffReportMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: StaffReportMultiDeleteDialogProps<TData>) {
    const { millId } = useParams<{ millId: string }>()
    const bulkDeleteMutation = useBulkDeleteStaff(millId || '')
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        if (!millId) return

        const ids = selectedRows
            .map((row) => (row.original as StaffReportData)?._id)
            .filter((id): id is string => !!id)

        if (ids.length === 0) return

        try {
            await bulkDeleteMutation.mutateAsync(ids)
            table.resetRowSelection()
            onOpenChange(false)
        } catch (error: any) {
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
