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
import { useDeleteGovtPaddyInward } from '../data/hooks'
import { type GovtPaddyInward } from '../data/schema'
import { useGovtPaddyInward } from './govt-paddy-inward-provider'

type GovtPaddyInwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: GovtPaddyInward | null
}

export function GovtPaddyInwardDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: GovtPaddyInwardDeleteDialogProps) {
    const { millId } = useGovtPaddyInward()
    const { t } = useTranslation('mill-staff')
    const { mutateAsync: deleteGovtPaddyInward, isPending } =
        useDeleteGovtPaddyInward(millId)

    const handleDelete = async () => {
        if (!currentRow?._id) return

        try {
            await deleteGovtPaddyInward(currentRow._id)
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
                        {t('common.deleteRecord')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('common.deleteRecordFor')}{' '}
                        <strong>{currentRow?.truckNumber}</strong>?
                        <br />
                        {t('common.actionCannotBeUndone')}
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
