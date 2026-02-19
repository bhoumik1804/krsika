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
import { type GovtRiceOutward } from '../data/schema'
import { useDeleteGovtRiceOutward } from '../data/hooks'
import { useGovtRiceOutward } from './govt-rice-outward-provider'

type GovtRiceOutwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: GovtRiceOutward | null
}

export function GovtRiceOutwardDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: GovtRiceOutwardDeleteDialogProps) {
    const { millId, setOpen, setCurrentRow } = useGovtRiceOutward()
    const deleteMutation = useDeleteGovtRiceOutward(millId)

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
                        <strong>{currentRow?.lotNo}</strong>?
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
