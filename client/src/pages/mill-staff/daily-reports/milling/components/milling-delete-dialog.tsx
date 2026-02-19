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
import { type MillingEntry } from '../data/schema'

type MillingDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: MillingEntry | null
}

export function MillingDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: MillingDeleteDialogProps) {
    const handleDelete = () => {
        toast.promise(sleep(2000), {
            loading: 'Deleting milling record...',
            success: () => {
                onOpenChange(false)
                return 'Milling record deleted successfully'
            },
            error: 'Failed to delete milling record',
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Milling Record?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this milling record for{' '}
                        <strong>{currentRow?.paddyType}</strong> on{' '}
                        <strong>{currentRow?.date}</strong>?
                        <br />
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
