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
import { useBulkDeleteFinancialReceipt } from '../data/hooks'
import { FinancialReceipt } from '../data/schema'

type FinancialReceiptMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function FinancialReceiptMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: FinancialReceiptMultiDeleteDialogProps<TData>) {
    const { millId } = useParams<{ millId: string }>()
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const { mutate: bulkDelete, isPending } = useBulkDeleteFinancialReceipt()

    const handleDeleteSelected = () => {
        const ids = selectedRows
            .map((row) => (row.original as FinancialReceipt)._id)
            .filter(Boolean) as string[]

        if (ids.length === 0) return

        bulkDelete(
            { millId: millId || '', ids },
            {
                onSuccess: () => {
                    table.resetRowSelection()
                    onOpenChange(false)
                },
            }
        )
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
                        onClick={(e) => {
                            e.preventDefault()
                            handleDeleteSelected()
                        }}
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
