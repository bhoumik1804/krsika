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
import { useDeleteGovtRiceOutward } from '../data/hooks'
import { type GovtRiceOutward } from '../data/schema'
import { useGovtRiceOutward } from './govt-rice-outward-provider'

type GovtRiceOutwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: GovtRiceOutward | null
}

export function GovtRiceOutwardDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: GovtRiceOutwardDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { millId, setOpen, setCurrentRow } = useGovtRiceOutward()
    const deleteMutation = useDeleteGovtRiceOutward(millId)

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
                        <strong>{currentRow?.lotNo}</strong>?
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
