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
import { type InwardEntry } from '../data/schema'

type InwardsDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: InwardEntry | null
}

export function InwardsDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: InwardsDeleteDialogProps) {
    const handleDelete = () => {
        toast.promise(sleep(2000), {
            loading: 'Deleting entry...',
            success: () => {
                onOpenChange(false)
                return 'Entry deleted successfully'
            },
            error: 'Failed to delete entry',
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this entry for{' '}
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
