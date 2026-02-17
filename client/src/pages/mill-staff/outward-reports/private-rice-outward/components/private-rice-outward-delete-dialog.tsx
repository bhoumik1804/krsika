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
import { useDeletePrivateRiceOutward } from '../data/hooks'
import { type PrivateRiceOutward } from '../data/schema'
import { usePrivateRiceOutward } from './private-rice-outward-provider'

type PrivateRiceOutwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PrivateRiceOutward | null
}

export function PrivateRiceOutwardDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: PrivateRiceOutwardDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { millId, setOpen, setCurrentRow } = usePrivateRiceOutward()
    const deleteMutation = useDeletePrivateRiceOutward(millId)

    const handleDelete = () => {
        if (!currentRow?._id) return
        toast.promise(deleteMutation.mutateAsync(currentRow._id), {
            loading: t('common.deleting'),
            success: () => {
                setCurrentRow(null)
                setOpen(null)
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
