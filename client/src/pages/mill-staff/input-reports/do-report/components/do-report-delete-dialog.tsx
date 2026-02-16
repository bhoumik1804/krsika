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
import { useTranslation } from 'react-i18next'
import { useDeleteDoReport } from '../data/hooks'
import { type DoReportData } from '../data/schema'
import { useDoReport } from './do-report-provider'

type DoReportDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: DoReportData
}

export function DoReportDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: DoReportDeleteDialogProps) {
    const { millId } = useDoReport()
    const { t } = useTranslation('mill-staff')
    const { mutate: deleteDoReport, isPending: isDeleting } = useDeleteDoReport(
        millId || ''
    )

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        if (currentRow._id) {
            deleteDoReport(currentRow._id, {
                onSuccess: () => {
                    onOpenChange(false)
                },
            })
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('delete.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('delete.descriptionItem')}
                        <strong>{currentRow.doNo}</strong>?
                        <br />
                        {t('delete.undone')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        {t('common.cancel')}
                    </AlertDialogCancel>
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
