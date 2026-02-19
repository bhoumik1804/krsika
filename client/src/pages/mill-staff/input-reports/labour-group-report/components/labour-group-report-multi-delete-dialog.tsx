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
import { useBulkDeleteLabourGroup } from '../data/hooks'
import { type LabourGroupReportData } from '../data/schema'

type LabourGroupReportMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function LabourGroupReportMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: LabourGroupReportMultiDeleteDialogProps<TData>) {
    const { millId } = useParams<{ millId: string }>()
    const mutation = useBulkDeleteLabourGroup(millId || '')
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        const selectedIds = selectedRows.map(
            (row) => (row.original as LabourGroupReportData)._id as string
        )

        try {
            await mutation.mutateAsync(selectedIds)
            table.resetRowSelection()
            onOpenChange(false)
        } catch (error) {
            // Error handling is managed by the mutation hook
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
                    <AlertDialogCancel disabled={mutation.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDeleteSelected()
                        }}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
