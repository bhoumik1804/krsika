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
import { useDeleteCommittee } from '../data/hooks'
import { type CommitteeReportData } from '../data/schema'
import { useCommitteeReport } from './committee-report-provider'

type CommitteeReportDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: CommitteeReportData
}

export function CommitteeReportDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: CommitteeReportDeleteDialogProps) {
    const { millId } = useCommitteeReport()
    const { mutate: deleteCommittee, isPending: isDeleting } =
        useDeleteCommittee(millId)
    const { t } = useTranslation('mill-staff')

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        if (currentRow._id) {
            deleteCommittee(currentRow._id, {
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
                        {t('inputReports.delete.descriptionItem')}
                        <strong>{currentRow.committeeName}</strong>?
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
                        {isDeleting ? t('common.deleting') : t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
