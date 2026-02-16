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
import { type MillingEntry } from '../data/schema'

type MillingDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: MillingEntry | null
}

export function MillingDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: MillingDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')

    const handleDelete = () => {
        toast.promise(sleep(2000), {
            loading: t('milling.deleting'),
            success: () => {
                onOpenChange(false)
                return t('milling.deletedSuccess')
            },
            error: t('milling.deleteFailed'),
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('milling.deleteTitle')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('milling.deleteDescription')}{' '}
                        <strong>{currentRow?.paddyType}</strong>?
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

