import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useVerifyMill } from '../data/hooks'
import { type Mill } from '../data/schema'

type MillsRejectionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: Mill | null
}

export function MillsRejectionDialog({
    open,
    onOpenChange,
    currentRow,
}: MillsRejectionDialogProps) {
    const [rejectionReason, setRejectionReason] = useState<string>('')
    const verifyMill = useVerifyMill()

    const isPending = verifyMill.status === 'pending'

    const handleReject = () => {
        if (!currentRow || !rejectionReason.trim()) {
            return
        }

        verifyMill.mutate(
            {
                id: currentRow.id,
                status: 'rejected' as const,
                rejectionReason: rejectionReason.trim(),
            },
            {
                onSuccess: () => {
                    setRejectionReason('')
                    onOpenChange(false)
                },
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader className='text-start'>
                    <DialogTitle>Reject Mill</DialogTitle>
                    <DialogDescription>
                        {currentRow?.name
                            ? `Rejecting: ${currentRow.name}`
                            : ''}
                    </DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                    <div>
                        <label className='text-sm font-medium'>
                            Rejection Reason{' '}
                            <span className='text-red-500'>*</span>
                        </label>
                        <Textarea
                            placeholder='Please provide the reason for rejecting this mill...'
                            className='mt-2'
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={4}
                        />
                        <p className='mt-1 text-xs text-muted-foreground'>
                            This reason will be visible to the mill owner.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={() => {
                            setRejectionReason('')
                            onOpenChange(false)
                        }}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type='button'
                        variant='destructive'
                        onClick={handleReject}
                        disabled={isPending || !rejectionReason.trim()}
                    >
                        {isPending ? 'Rejecting...' : 'Reject'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
