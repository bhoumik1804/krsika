import { type Table } from '@tanstack/react-table'
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
import { useBulkDeleteBrokers } from '../data/hooks'
import { type BrokerReportData } from '../data/schema'
import { useBrokerReport } from './broker-report-provider'

type BrokerReportMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function BrokerReportMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: BrokerReportMultiDeleteDialogProps<TData>) {
    const { millId } = useBrokerReport()
    const { mutate: bulkDelete, isPending } = useBulkDeleteBrokers(millId)
    const { t } = useTranslation('mill-staff')
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = (e: React.MouseEvent) => {
        e.preventDefault()
        const ids = selectedRows
            .map((row) => (row.original as BrokerReportData)._id)
            .filter(Boolean) as string[]

        bulkDelete(ids, {
            onSuccess: () => {
                table.resetRowSelection()
                onOpenChange(false)
            },
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('inputReports.delete.multiTitle', {
                            count: selectedRows.length,
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('inputReports.delete.multiDescription')}
                        <br />
                        {t('inputReports.delete.undone')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        {t('common.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteSelected}
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
