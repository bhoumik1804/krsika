'use client'

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
import { PrivateGunnyOutward } from '../data/schema'
import { usePrivateGunnyOutward } from './private-gunny-outward-provider'
import { useDeletePrivateGunnyOutward } from '../data/hooks'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PrivateGunnyOutward | null
}

export function PrivateGunnyOutwardDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: Props) {
    const { millId } = usePrivateGunnyOutward()
    const deleteMutation = useDeletePrivateGunnyOutward(millId)

    const handleDelete = async () => {
        if (!currentRow?._id) return
        try {
            await deleteMutation.mutateAsync(currentRow._id)
            onOpenChange(false)
        } catch (error) {
            // Error handling is done in the mutation hook
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
                        <strong>{currentRow?.gunnyPurchaseDealNumber}</strong>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteMutation.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
