'use client'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
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
import { useDeletePrivateGunnyOutward } from '../data/hooks'
import { PrivateGunnyOutward } from '../data/schema'
import { usePrivateGunnyOutward } from './private-gunny-outward-provider'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PrivateGunnyOutward | null
}

export function PrivateGunnyOutwardDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: Props) {
    const { t } = useTranslation('mill-staff')
    const { millId } = usePrivateGunnyOutward()
    const deleteMutation = useDeletePrivateGunnyOutward(millId)

    const handleDelete = () => {
        if (!currentRow?._id) return
        toast.promise(deleteMutation.mutateAsync(currentRow._id), {
            loading: t('common.deleting'),
            success: () => {
                onOpenChange(false)
                return t('common.success')
            },
            error: t('common.error'),
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('common.deleteRecord')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('common.deleteRecordFor')}{' '}
                        <strong>{currentRow?.gunnySaleDealNumber}</strong>
                        <br />
                        {t('common.actionCannotBeUndone')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                        onClick={handleDelete}
                    >
                        {t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
