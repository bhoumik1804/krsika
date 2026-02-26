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
import { useDeleteGunnyPurchase } from '../data/hooks'
import { type GunnyPurchaseData } from '../data/schema'
import { useGunny } from './gunny-provider'

type GunnyDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: GunnyPurchaseData | null
}

export function GunnyDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: GunnyDeleteDialogProps) {
    const { millId } = useGunny()
    const { mutateAsync: deleteGunnyPurchase, isPending: isDeleting } =
        useDeleteGunnyPurchase(millId)

    const handleDelete = async () => {
        if (currentRow?._id) {
            try {
                await deleteGunnyPurchase(currentRow._id)
                onOpenChange(false)
            } catch (error) {
                console.error('Error deleting purchase:', error)
            }
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Gunny Purchase?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the gunny purchase from{' '}
                        <strong>{currentRow?.partyName}</strong> on{' '}
                        <strong>{currentRow?.date}</strong>? <br />
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
