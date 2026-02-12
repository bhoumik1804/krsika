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
import { useDeleteGovtPaddyInward } from '../data/hooks'
import { type GovtPaddyInward } from '../data/schema'
import { useGovtPaddyInward } from './govt-paddy-inward-provider'

type GovtPaddyInwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: GovtPaddyInward | null
}

export function GovtPaddyInwardDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: GovtPaddyInwardDeleteDialogProps) {
    const { millId } = useGovtPaddyInward()
    const { mutateAsync: deleteGovtPaddyInward, isPending } =
        useDeleteGovtPaddyInward(millId)

    const handleDelete = async () => {
        if (!currentRow?._id) return

        try {
            await deleteGovtPaddyInward(currentRow._id)
            onOpenChange(false)
        } catch (error) {
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
                        <strong>{currentRow?.truckNumber}</strong>?
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
