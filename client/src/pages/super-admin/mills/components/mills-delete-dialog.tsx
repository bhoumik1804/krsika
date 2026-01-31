'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteMill } from '../data/hooks'
import type { Mill } from '../data/schema'

type MillDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: Mill
}

export function MillsDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: MillDeleteDialogProps) {
    const [value, setValue] = useState('')
    const deleteMill = useDeleteMill()

    const handleDelete = async () => {
        if (value.trim() !== currentRow.name) return

        await deleteMill.mutateAsync(currentRow.id)
        setValue('')
        onOpenChange(false)
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={(state) => {
                if (!deleteMill.isPending) {
                    setValue('')
                    onOpenChange(state)
                }
            }}
            handleConfirm={handleDelete}
            disabled={value.trim() !== currentRow.name || deleteMill.isPending}
            title={
                <span className='text-destructive'>
                    <AlertTriangle
                        className='me-1 inline-block stroke-destructive'
                        size={18}
                    />{' '}
                    Delete Mill
                </span>
            }
            desc={
                <div className='space-y-4'>
                    <p className='mb-2'>
                        Are you sure you want to delete{' '}
                        <span className='font-bold'>{currentRow.name}</span>?
                        <br />
                        This action will permanently remove the mill from the
                        system. This cannot be undone.
                    </p>

                    <Label className='my-2'>
                        Mill Name:
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder='Enter mill name to confirm deletion.'
                            disabled={deleteMill.isPending}
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
            confirmText={deleteMill.isPending ? 'Deleting...' : 'Delete'}
            destructive
        />
    )
}
