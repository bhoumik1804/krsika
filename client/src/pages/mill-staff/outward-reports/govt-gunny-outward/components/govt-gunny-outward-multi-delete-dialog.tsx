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
import { useBulkDeleteGovtGunnyOutward } from '../data/hooks'
import { type GovtGunnyOutward } from '../data/schema'
import { useGovtGunnyOutward } from './govt-gunny-outward-provider'

interface Props<TData> {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function GovtGunnyOutwardMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: Props<TData>) {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const { millId } = useGovtGunnyOutward()
    const bulkDeleteMutation = useBulkDeleteGovtGunnyOutward(millId)

    const handleDeleteSelected = async () => {
        const ids = selectedRows
            .map((row) => (row.original as GovtGunnyOutward)._id)
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
                        This action cannot be undone. This will permanently
                        delete selected records.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                        onClick={handleDeleteSelected}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
