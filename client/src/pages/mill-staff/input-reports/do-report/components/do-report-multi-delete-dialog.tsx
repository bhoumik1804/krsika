import { type Table } from '@tanstack/react-table'
import { toast } from 'sonner'
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
import { useBulkDeleteDoReport } from '../data/hooks'
import { type DoReportData } from '../data/schema'
import { useDoReport } from './do-report-provider'

type DoReportMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DoReportMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: DoReportMultiDeleteDialogProps<TData>) {
    const { millId } = useDoReport()
    const { t } = useTranslation('mill-staff')
    const { mutateAsync: bulkDelete, isPending } = useBulkDeleteDoReport(millId)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = (e: React.MouseEvent) => {
        e.preventDefault()
        const ids = selectedRows
            .map((row) => (row.original as DoReportData)._id)
            .filter(Boolean) as string[]

        toast.promise(bulkDelete(ids), {
            loading: t('common.deletingSelected'),
            success: () => {
                table.resetRowSelection()
                onOpenChange(false)
                return t('common.deletedSelectedSuccess', {
                    count: ids.length,
                })
            },
            error: t('common.deleteSelectedError'),
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
