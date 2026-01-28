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
import { type GunnyPurchase } from '../data/schema'

type GunnyDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: GunnyPurchase | null
}

export function GunnyDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: GunnyDeleteDialogProps) {
    const handleDelete = () => {
        toast.promise(sleep(2000), {
            loading: 'Deleting purchase...',
            success: () => {
                onOpenChange(false)
                return 'Purchase deleted successfully'
            },
            error: 'Failed to delete purchase',
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Purchase?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this purchase record for{' '}
                        <strong>{currentRow?.partyName}</strong>?
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
