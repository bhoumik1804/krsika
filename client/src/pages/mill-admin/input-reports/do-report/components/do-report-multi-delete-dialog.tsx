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
import { useBulkDeleteDoReport } from '../data/hooks'
import { type DoReportData } from '../data/schema'
import { useDoReport } from './do-report-provider'

type DoReportMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DoReportMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: DoReportMultiDeleteDialogProps<TData>) {
    const { millId } = useDoReport()
    const { mutateAsync: bulkDelete, isPending } = useBulkDeleteDoReport(millId)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = (e: React.MouseEvent) => {
        e.preventDefault()
        const ids = selectedRows
            .map((row) => (row.original as DoReportData)._id)
            .filter(Boolean) as string[]

        toast.promise(bulkDelete(ids), {
            loading: `Deleting ${ids.length} record${ids.length > 1 ? 's' : ''}...`,
            success: () => {
                table.resetRowSelection()
                onOpenChange(false)
                return `${ids.length} record${ids.length > 1 ? 's' : ''} deleted successfully`
            },
            error: 'Failed to delete records',
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
