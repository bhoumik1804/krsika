import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
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
import { type ProductionEntry } from '../data/schema'

type ProductionDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: ProductionEntry | null
}

export function ProductionDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: ProductionDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')

    const handleDelete = () => {
        toast.promise(sleep(2000), {
            loading: t('production.deleting'),
            success: () => {
                onOpenChange(false)
                return t('production.deletedSuccess')
            },
            error: t('production.deleteFailed'),
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('production.deleteTitle')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('production.deleteDescription')}{' '}
                        <strong>{currentRow?.itemName}</strong>?
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

