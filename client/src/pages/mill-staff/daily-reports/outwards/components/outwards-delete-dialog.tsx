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
import { type OutwardEntry } from '../data/schema'

type OutwardsDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: OutwardEntry | null
}

export function OutwardsDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: OutwardsDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')

    const handleDelete = () => {
        toast.promise(sleep(2000), {
            loading: t('outwards.deleting'),
            success: () => {
                onOpenChange(false)
                return t('outwards.deletedSuccess')
            },
            error: t('outwards.deleteFailed'),
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('outwards.deleteTitle')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('outwards.deleteDescription')}{' '}
                        <strong>{currentRow?.gatePassNumber}</strong>?
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

