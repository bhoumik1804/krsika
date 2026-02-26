'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
    const { t } = useTranslation('mill-staff')
    const [value, setValue] = useState('')

    const handleDelete = () => {
        if (value.trim() !== currentRow.fullName) return

        onOpenChange(false)
        showSubmittedData(currentRow, t('staff.deletedStaffInfo'))
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
                    {t('staff.deleteStaff')}
                </span>
            }
            desc={
                <div className='space-y-4'>
                    <p className='mb-2'>
                        {t('staff.deleteDescription', {
                            name: currentRow.fullName,
                            post: currentRow.post?.toUpperCase(),
                        })}
                    </p>

                    <Label className='my-2'>
                        {t('staff.deleteConfirmLabel')}
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={t('staff.deleteConfirmPlaceholder')}
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
