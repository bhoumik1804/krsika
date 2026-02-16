'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

type StaffMultiDeleteDialogProps<TData> = {
    open: boolean
    onOpenChange: (open: boolean) => void
    table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function StaffMultiDeleteDialog<TData>({
    open,
    onOpenChange,
    table,
}: StaffMultiDeleteDialogProps<TData>) {
    const { t } = useTranslation('millStaff')
    const [value, setValue] = useState('')

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDelete = () => {
        if (value.trim() !== CONFIRM_WORD) {
            toast.error(
                t('staff.multiDeleteConfirmError', { word: CONFIRM_WORD }) ||
                    `Please type "${CONFIRM_WORD}" to confirm.`
            )
            return
        }

        onOpenChange(false)

        toast.promise(sleep(2000), {
            loading: t('staff.deletingStaff'),
            success: () => {
                setValue('')
                table.resetRowSelection()
                return t('staff.deletedStaffSuccess', {
                    count: selectedRows.length,
                    member: selectedRows.length > 1 ? 'members' : 'member',
                })
            },
            error: t('staff.deleteSelectedError') || 'Error',
        })
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            handleConfirm={handleDelete}
            disabled={value.trim() !== CONFIRM_WORD}
            title={
                <span className='text-destructive'>
                    <AlertTriangle
                        className='me-1 inline-block stroke-destructive'
                        size={18}
                    />{' '}
                    {t('staff.multiDeleteTitle', {
                        count: selectedRows.length,
                        member: selectedRows.length > 1 ? 'members' : 'member',
                    })}
                </span>
            }
            desc={
                <div className='space-y-4'>
                    <p className='mb-2'>{t('staff.multiDeleteDescription')}</p>

                    <Label className='my-4 flex flex-col items-start gap-1.5'>
                        <span className=''>
                            {t('staff.multiDeleteConfirmLabel', {
                                word: CONFIRM_WORD,
                            })}
                        </span>
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={t(
                                'staff.multiDeleteConfirmPlaceholder',
                                {
                                    word: CONFIRM_WORD,
                                }
                            )}
                        />
                    </Label>

                    <Alert variant='destructive'>
                        <AlertTitle>{t('staff.warning')}</AlertTitle>
                        <AlertDescription>
                            {t('staff.actionRollbackWarning')}
                        </AlertDescription>
                    </Alert>
                </div>
            }
            confirmText={t('common.delete')}
            destructive
        />
    )
}
