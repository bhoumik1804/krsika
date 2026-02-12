import { toast } from 'sonner'
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
import { useDeleteSilkyKodhaOutward } from '../data/hooks'
import { type SilkyKodhaOutward } from '../data/schema'
import { silkyKodhaOutward } from './silky-kodha-outward-provider'

type SilkyKodhaOutwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: SilkyKodhaOutward | null
}

export function SilkyKodhaOutwardDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: SilkyKodhaOutwardDeleteDialogProps) {
    const { millId } = silkyKodhaOutward()
    const deleteMutation = useDeleteSilkyKodhaOutward(millId)

    const handleDelete = () => {
        if (!currentRow?._id) return

        deleteMutation.mutate(currentRow._id, {
            onSuccess: () => {
                toast.success('Deleted successfully')
                onOpenChange(false)
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to delete')
            },
        })
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
