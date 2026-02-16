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
import { useDeletePrivateRiceOutward } from '../data/hooks'
import { type PrivateRiceOutward } from '../data/schema'
import { useOutwardBalanceLiftingRice } from './outward-balance-lifting-rice-provider'

type OutwardBalanceLiftingRiceDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: PrivateRiceOutward | null
}

export function OutwardBalanceLiftingRiceDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: OutwardBalanceLiftingRiceDeleteDialogProps) {
    const { millId } = useOutwardBalanceLiftingRice()
    const { mutateAsync: deleteEntry, isPending: isDeleting } =
        useDeletePrivateRiceOutward(millId)

    const handleDelete = async () => {
        if (currentRow?._id) {
            try {
                await deleteEntry(currentRow._id)
                onOpenChange(false)
            } catch (error) {
                console.error('Error deleting entry:', error)
            }
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this outward entry for{' '}
                        <strong>{currentRow?.partyName}</strong>?
                        <br />
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
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
