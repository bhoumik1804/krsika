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
import { type PrivateRiceOutward } from '../data/schema'
import { useDeletePrivateRiceOutward } from '../data/hooks'
import { usePrivateRiceOutward } from './private-rice-outward-provider'

type PrivateRiceOutwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PrivateRiceOutward | null
}

export function PrivateRiceOutwardDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: PrivateRiceOutwardDeleteDialogProps) {
    const { millId, setOpen, setCurrentRow } = usePrivateRiceOutward()
    const deleteMutation = useDeletePrivateRiceOutward(millId)

    const handleDelete = async () => {
        if (!currentRow?._id) return
        try {
            await deleteMutation.mutateAsync(currentRow._id)
            setCurrentRow(null)
            setOpen(null)
            onOpenChange(false)
        } catch {
            // Error is handled by mutation hook
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
