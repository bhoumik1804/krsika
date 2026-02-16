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
import { type InwardEntry } from '../data/schema'

type InwardsDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: InwardEntry | null
}

export function InwardsDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: InwardsDeleteDialogProps) {
    const { t } = useTranslation()

    const handleDelete = () => {
        toast.promise(sleep(2000), {
            loading: t('inwards.deleting'),
            success: () => {
                onOpenChange(false)
                return t('inwards.deletedSuccess')
            },
            error: t('inwards.deleteFailed'),
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('inwards.deleteTitle')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('inwards.deleteDescription')}{' '}
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
