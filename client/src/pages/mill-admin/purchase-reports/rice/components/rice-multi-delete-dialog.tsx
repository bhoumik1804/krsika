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
import { useBulkDeleteRicePurchases } from '../data/hooks'
import { useRice } from './rice-provider'
import { type RicePurchaseData } from '../data/schema'

type RiceMultiDeleteDialogProps = {
    table: Table<RicePurchaseData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function RiceMultiDeleteDialog({
    table,
    open,
    onOpenChange,
}: RiceMultiDeleteDialogProps) {
    const { millId } = useRice()
    const { mutate: bulkDeleteRicePurchases, isPending: isDeleting } =
        useBulkDeleteRicePurchases(millId)

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = () => {
        const ids = selectedRows.map(
            (row) => (row.original as RicePurchaseData).id
        )
        bulkDeleteRicePurchases(ids, {
            onSuccess: () => {
                table.resetRowSelection()
                onOpenChange(false)
            },
        })
    }
            success: () => {
                table.resetRowSelection()
                onOpenChange(false)
                return `Deleted ${selectedRows.length} rice purchase record${selectedRows.length > 1 ? 's' : ''}`
            },
            error: 'Error deleting records',
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete {selectedRows.length} rice purchase record
                        {selectedRows.length > 1 ? 's' : ''}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the selected rice
                        purchase records? <br />
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
