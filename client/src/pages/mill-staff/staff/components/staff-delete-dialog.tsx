'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Staff } from '../data/schema'

type StaffDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: Staff
}

export function StaffDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: StaffDeleteDialogProps) {
    const [value, setValue] = useState('')

    const handleDelete = () => {
        if (value.trim() !== currentRow.fullName) return

        onOpenChange(false)
        showSubmittedData(
            currentRow,
            'The following staff member has been deleted:'
        )
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            handleConfirm={handleDelete}
            disabled={value.trim() !== currentRow.fullName}
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
                        This action will permanently remove the staff member
                        {currentRow.post && (
                            <>
                                {' '}
                                with the post of{' '}
                                <span className='font-bold'>
                                    {currentRow.post.toUpperCase()}
                                </span>
                            </>
                        )}{' '}
                        from the system. This cannot be undone.
                    </p>

                    <Label className='my-2'>
                        Full Name:
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
            confirmText='Delete'
            destructive
        />
    )
}
