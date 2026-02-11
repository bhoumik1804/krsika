'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useParams } from 'react-router'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteStaff } from '../data/hooks'
import { type StaffResponse } from '../data/types'

type StaffDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: StaffResponse
}

export function StaffDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: StaffDeleteDialogProps) {
    const { millId } = useParams<{ millId: string }>()
    const [value, setValue] = useState('')
    const { mutateAsync: deleteStaff, isPending } = useDeleteStaff(millId || '')

    const handleDelete = async () => {
        if (value.trim() !== currentRow.fullName) return

        try {
            await deleteStaff(currentRow._id)
            onOpenChange(false)
            setValue('')
        } catch (error) {
            // Error handled by hook
            console.error('Delete error:', error)
        }
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            handleConfirm={handleDelete}
            disabled={value.trim() !== currentRow.fullName || isPending}
            title={
                <span className='text-destructive'>
                    <AlertTriangle
                        className='me-1 inline-block stroke-destructive'
                        size={18}
                    />{' '}
                    Delete Staff
                </span>
            }
            desc={
                <div className='space-y-4'>
                    <p className='mb-2'>
                        Are you sure you want to delete{' '}
                        <span className='font-bold'>{currentRow.fullName}</span>
                        ?
                        <br />
                        This action will permanently remove this staff member
                        from the system. This cannot be undone.
                    </p>

                    <Label className='my-2 flex flex-col items-start gap-2'>
                        <span className='text-nowrap'>Full Name:</span>
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder='Enter full name to confirm deletion.'
                        />
                    </Label>

                    <Alert variant='destructive'>
                        <AlertTitle>Warning!</AlertTitle>
                        <AlertDescription>
                            Please be careful, this operation can not be rolled
                            back.
                        </AlertDescription>
                    </Alert>
                </div>
            }
            confirmText={isPending ? 'Deleting...' : 'Delete'}
            destructive
        />
    )
}
