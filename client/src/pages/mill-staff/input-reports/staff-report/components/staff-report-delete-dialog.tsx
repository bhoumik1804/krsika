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
import { useDeleteStaff } from '../data/hooks'
import { type StaffReportData } from '../data/schema'
import { useStaffReport } from './staff-report-provider'

type StaffReportDeleteDialogProps = {
    currentRow: StaffReportData
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function StaffReportDeleteDialog({
    currentRow,
    open,
    onOpenChange,
}: StaffReportDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useStaffReport()
    const { mutate: deleteStaff, isPending: isDeleting } =
        useDeleteStaff(millId)

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        const staffId = currentRow._id
        if (staffId) {
            deleteStaff(staffId, {
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
                    <AlertDialogTitle>{t('common.delete')}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('common.deleteConfirmation', {
                            name: currentRow.fullName,
                        })}
                        <br />
                        {t('common.uCannotUndo')}
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
                        {isDeleting
                            ? t('common.deleting') + '...'
                            : t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
