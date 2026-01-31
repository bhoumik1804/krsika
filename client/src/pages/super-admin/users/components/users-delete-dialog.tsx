'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteUser } from '../data/hooks'
import { type User } from '../data/schema'

type UserDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: User
}

export function UsersDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: UserDeleteDialogProps) {
    const [value, setValue] = useState('')
    const deleteUser = useDeleteUser()

    const handleDelete = async () => {
        if (value.trim() !== currentRow.email) return

        try {
            await deleteUser.mutateAsync(currentRow.id)
            onOpenChange(false)
            setValue('')
        } catch (error) {
            // Error handled by mutation hook
        }
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={(state) => {
                setValue('')
                onOpenChange(state)
            }}
            handleConfirm={handleDelete}
            disabled={value.trim() !== currentRow.email || deleteUser.isPending}
            title={
                <span className='text-destructive'>
                    <AlertTriangle
                        className='me-1 inline-block stroke-destructive'
                        size={18}
                    />{' '}
                    Delete User
                </span>
            }
            desc={
                <div className='space-y-4'>
                    <p className='mb-2'>
                        Are you sure you want to delete{' '}
                        <span className='font-bold'>
                            {currentRow.fullName || currentRow.email}
                        </span>
                        ?
                        <br />
                        This action will permanently remove the user with the
                        role of{' '}
                        <span className='font-bold'>
                            {currentRow.role.toUpperCase()}
                        </span>{' '}
                        from the system. This cannot be undone.
                    </p>

                    <Label className='my-2'>
                        Email:
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder='Enter email to confirm deletion.'
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
            confirmText={deleteUser.isPending ? 'Deleting...' : 'Delete'}
            destructive
        />
    )
}
