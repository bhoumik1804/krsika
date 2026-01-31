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
import { type OutwardEntry } from '../data/schema'

type OutwardsDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: OutwardEntry | null
}

export function OutwardsDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: OutwardsDeleteDialogProps) {
    const handleDelete = () => {
        toast.promise(sleep(2000), {
            loading: 'Deleting outward entry...',
            success: () => {
                onOpenChange(false)
                return 'Outward entry deleted successfully'
            },
            error: 'Failed to delete outward entry',
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Outward Entry?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this outward entry for{' '}
                        <strong>{currentRow?.gatePassNumber}</strong>?
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
