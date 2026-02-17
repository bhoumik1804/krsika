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
import { useDeleteFrkOutward } from '../data/hooks'
import { useFrkOutward } from './frk-outward-provider'

type FrkOutwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function FrkOutwardDeleteDialog({
    open,
    onOpenChange,
}: FrkOutwardDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { millId, currentRow } = useFrkOutward()
    const deleteMutation = useDeleteFrkOutward()

    const handleDelete = () => {
        if (!currentRow?._id) return

        toast.promise(
            deleteMutation.mutateAsync({
                millId,
                id: currentRow._id,
            }),
            {
                loading: t('common.deleting'),
                success: () => {
                    onOpenChange(false)
                    return t('common.success')
                },
                error: t('common.error'),
            }
        )
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
                        <strong>{currentRow?.partyName}</strong>?
                        <br />
                        {t('common.actionCannotBeUndone')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        {t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
