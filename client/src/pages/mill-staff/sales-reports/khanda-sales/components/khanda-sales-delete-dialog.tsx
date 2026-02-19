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
import { useDeleteKhandaSales } from '../data/hooks'
import type { KhandaSalesResponse } from '../data/types'
import { useKhandaSales } from './khanda-sales-provider'

type KhandaSalesDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: KhandaSalesResponse | null
}

export function KhandaSalesDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: KhandaSalesDeleteDialogProps) {
    const { millId } = useKhandaSales()
    const { mutateAsync: deleteKhandaSales, isPending } =
        useDeleteKhandaSales(millId)

    const handleDelete = async () => {
        if (!currentRow?._id) return
        try {
            await deleteKhandaSales(currentRow._id)
            onOpenChange(false)
        } catch (error) {
            // Error handling is managed by mutation hook
            console.error('Delete error:', error)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Record?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this record for{' '}
                        <strong>{currentRow?.partyName}</strong>?
                        <br />
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
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
