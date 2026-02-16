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
import { useDeleteBroker } from '../data/hooks'
import { type BrokerReportData } from '../data/schema'
import { useBrokerReport } from './broker-report-provider'

type BrokerReportDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: BrokerReportData
}

export function BrokerReportDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: BrokerReportDeleteDialogProps) {
    const { millId } = useBrokerReport()
    const { mutate: deleteBroker, isPending: isDeleting } =
        useDeleteBroker(millId)
    const { t } = useTranslation('mill-staff')

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        if (currentRow._id) {
            deleteBroker(currentRow._id, {
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
                        <span
                            dangerouslySetInnerHTML={{
                                __html: t('delete.description', {
                                    name: currentRow.brokerName,
                                }),
                            }}
                        />
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
