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
import { GovtGunnyOutward } from '../data/schema'
import { useDeleteGovtGunnyOutward } from '../data/hooks'
import { useGovtGunnyOutward } from './govt-gunny-outward-provider'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: GovtGunnyOutward | null
}

export function GovtGunnyOutwardDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: Props) {
    const { millId, setOpen, setCurrentRow } = useGovtGunnyOutward()
    const deleteMutation = useDeleteGovtGunnyOutward(millId)

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
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the record for{' '}
                        <strong>{currentRow?.gunnyDmNumber}</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                        onClick={handleDelete}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
