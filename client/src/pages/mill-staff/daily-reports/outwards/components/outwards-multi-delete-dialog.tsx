import { type Table } from '@tanstack/react-table'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
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

type OutwardsMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OutwardsMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: OutwardsMultiDeleteDialogProps<TData>) {
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = () => {
        toast.promise(sleep(2000), {
            loading: 'Deleting outward entries...',
            success: () => {
                table.resetRowSelection()
                onOpenChange(false)
                return `Deleted ${selectedRows.length} outward entr${selectedRows.length > 1 ? ' ies' : 'y'}`
            },
            error: 'Error deleting outward entries',
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete {selectedRows.length} outward{' '}
                        {selectedRows.length > 1 ? 'entries' : 'entry'}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the selected outward
                        entries? <br />
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
