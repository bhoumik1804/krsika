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
import { useDeleteTransporter } from '../data/hooks'
import { type TransporterReportData } from '../data/schema'
import { useTransporterReport } from './transporter-report-provider'

type TransporterReportDeleteDialogProps = {
    currentRow: TransporterReportData
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function TransporterReportDeleteDialog({
    currentRow,
    open,
    onOpenChange,
}: TransporterReportDeleteDialogProps) {
    const { millId } = useTransporterReport()
    const { mutate: deleteTransporter, isPending: isDeleting } =
        useDeleteTransporter(millId)
    const { t } = useTranslation('mill-staff')

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        if (currentRow._id) {
            deleteTransporter(currentRow._id, {
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
                        {t('inputReports.delete.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('inputReports.delete.descriptionItem')}{' '}
                        <strong>{currentRow.transporterName}</strong>?
                        <br />
                        {t('inputReports.delete.undone')}
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
                        {isDeleting ? t('common.loading') : t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
