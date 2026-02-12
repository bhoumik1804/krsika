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
import { useDeleteOtherInward } from '../data/hooks'
import { useOtherInward } from './other-inward-provider'

type OtherInwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OtherInwardDeleteDialog({
    open,
    onOpenChange,
}: OtherInwardDeleteDialogProps) {
    const { currentRow, millId } = useOtherInward()
    const { mutateAsync: deleteOtherInward, isPending } =
        useDeleteOtherInward(millId)

    const handleDelete = async () => {
        if (!currentRow?._id) return
        try {
            await deleteOtherInward(currentRow._id)
            onOpenChange(false)
        } catch (error) {
            console.error('Delete error:', error)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the record for{' '}
                        <span className='font-bold'>
                            {currentRow?.itemName}
                        </span>
                        .
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className='bg-red-500 hover:bg-red-600'
                        disabled={isPending}
                    >
                        {isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
