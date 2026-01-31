'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useBulkDeleteMills } from '../data/hooks'
import type { Mill } from '../data/schema'

type MillMultiDeleteDialogProps<TData> = {
    open: boolean
    onOpenChange: (open: boolean) => void
    table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function MillsMultiDeleteDialog<TData extends Mill>({
    open,
    onOpenChange,
    table,
}: MillMultiDeleteDialogProps<TData>) {
    const [value, setValue] = useState('')
    const bulkDeleteMills = useBulkDeleteMills()

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDelete = async () => {
        if (value.trim() !== CONFIRM_WORD) {
            toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
            return
        }

        // Extract mill IDs from selected rows
        const millIds = selectedRows.map((row) => row.original.id)

        await bulkDeleteMills.mutateAsync(millIds)
        setValue('')
        table.resetRowSelection()
        onOpenChange(false)
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={(state) => {
                if (!bulkDeleteMills.isPending) {
                    setValue('')
                    onOpenChange(state)
                }
            }}
            handleConfirm={handleDelete}
            disabled={
                value.trim() !== CONFIRM_WORD || bulkDeleteMills.isPending
            }
            title={
                <span className='text-destructive'>
                    <AlertTriangle
                        className='me-1 inline-block stroke-destructive'
                        size={18}
                    />{' '}
                    Delete {selectedRows.length}{' '}
                    {selectedRows.length > 1 ? 'mills' : 'mill'}
                </span>
            }
            desc={
                <div className='space-y-4'>
                    <p className='mb-2'>
                        Are you sure you want to delete the selected mills?{' '}
                        <br />
                        This action cannot be undone.
                    </p>

                    <Label className='my-4 flex flex-col items-start gap-1.5'>
                        <span className=''>
                            Confirm by typing "{CONFIRM_WORD}":
                        </span>
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
                            disabled={bulkDeleteMills.isPending}
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
            confirmText={bulkDeleteMills.isPending ? 'Deleting...' : 'Delete'}
            destructive
        />
    )
}
