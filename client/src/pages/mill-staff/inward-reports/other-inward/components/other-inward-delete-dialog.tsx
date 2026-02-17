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
import { useDeleteOtherInward } from '../data/hooks'
import { useOtherInward } from './other-inward-provider'

type OtherInwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OtherInwardDeleteDialog({
    open,
    onOpenChange,
}: OtherInwardDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { currentRow, millId } = useOtherInward()
    const { mutateAsync: deleteOtherInward, isPending } =
        useDeleteOtherInward(millId)

    const handleDelete = async () => {
        if (!currentRow?._id) return
        try {
            await deleteOtherInward(currentRow._id)
            onOpenChange(false)
        } catch (error) {
            console.error('Delete error:', error)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('common.areYouSure')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('common.deleteWarning')}{' '}
                        <span className='font-bold'>
                            {currentRow?.itemName}
                        </span>
                        .
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        {t('common.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className='bg-red-500 hover:bg-red-600'
                        disabled={isPending}
                    >
                        {isPending ? t('common.deleting') : t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
