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

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PrivateGunnyOutward
}

export function PrivateGunnyOutwardDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: Props) {
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
                        <strong>{currentRow?.truckNo}</strong> on{' '}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                        onClick={() => onOpenChange(false)}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
