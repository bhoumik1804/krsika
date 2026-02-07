import { type Table } from '@tantml:react-table'
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
import { useBulkDeletePaddyPurchases } from '../data/hooks'
import { usePaddy } from './paddy-provider'
import { type PaddyPurchaseData } from '../data/schema'

type PaddyMultiDeleteDialogProps = {
    table: Table<PaddyPurchaseData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PaddyMultiDeleteDialog({
    table,
    open,
    onOpenChange,
}: PaddyMultiDeleteDialogProps) {
    const { millId } = usePaddy()
    const { mutate: bulkDeletePaddyPurchases, isPending: isDeleting } =
        useBulkDeletePaddyPurchases(millId)

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = () => {
        const ids = selectedRows.map(
            (row) => (row.original as PaddyPurchaseData).id
        )
        bulkDeletePaddyPurchases(ids, {
            onSuccess: () => {
                table.resetRowSelection()
                onOpenChange(false)
            },
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete {selectedRows.length}{' '}
                        {selectedRows.length > 1 ? 'purchases' : 'purchase'}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the selected purchases?{' '}
                        <br />
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteSelected}
                        disabled={isDeleting}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
