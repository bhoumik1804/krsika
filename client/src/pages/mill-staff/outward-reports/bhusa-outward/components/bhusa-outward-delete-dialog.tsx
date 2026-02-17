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
import { useDeleteBhusaOutward } from '../data/hooks'
import { type BhusaOutward } from '../data/schema'

type BhusaOutwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: BhusaOutward | null
    millId: string
}

export function BhusaOutwardDeleteDialog({
    open,
    onOpenChange,
    currentRow,
    millId,
}: BhusaOutwardDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')
    const deleteMutation = useDeleteBhusaOutward(millId)

    const handleDelete = () => {
        if (!currentRow?._id) return
        toast.promise(deleteMutation.mutateAsync(currentRow._id), {
            loading: t('common.deleting'),
            success: () => {
                onOpenChange(false)
                return t('common.success')
            },
            error: (error) => error.message || t('common.error'),
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
                        <strong>{currentRow?.partyName}</strong>?
                        <br />
                        {t('common.actionCannotBeUndone')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        {t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
