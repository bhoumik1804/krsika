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
import { useDeleteGunnyInward } from '../data/hooks'
import { gunnyInward } from './gunny-inward-provider'

type GunnyInwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function GunnyInwardDeleteDialog({
    open,
    onOpenChange,
}: GunnyInwardDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { millId, currentRow } = gunnyInward()
    const { mutate: deleteInward, isPending } = useDeleteGunnyInward(millId)

    const handleDelete = () => {
        if (!currentRow?._id) return

        deleteInward(currentRow._id, {
            onSuccess: () => {
                onOpenChange(false)
            },
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('gunnyInward.deleteRecord')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('common.deleteConfirmation')}{' '}
                        <strong>{currentRow?.partyName}</strong>?
                        <br />
                        {t('common.cannotBeUndone')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        {t('common.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isPending}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        {isPending ? t('common.deleting') : t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
