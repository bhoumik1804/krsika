import { useTranslation } from 'react-i18next'
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
import { useDeleteFrkInward } from '../data/hooks'
import { type FrkInward } from '../data/schema'
import { useFrkInward } from './frk-inward-provider'

type FrkInwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: FrkInward | null
}

export function FrkInwardDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: FrkInwardDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useFrkInward()
    const { mutateAsync: deleteFrkInward, isPending: isDeleting } =
        useDeleteFrkInward(millId)

    const handleDelete = async () => {
        if (!currentRow?._id) return
        try {
            await deleteFrkInward(currentRow._id)
            onOpenChange(false)
        } catch (error) {
            console.error('FRK inward delete error:', error)
        }
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
                        disabled={isDeleting}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        {isDeleting ? t('common.deleting') : t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
