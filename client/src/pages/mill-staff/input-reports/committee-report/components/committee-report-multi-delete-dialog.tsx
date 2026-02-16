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
import { useBulkDeleteCommittees } from '../data/hooks'
import { type CommitteeReportData } from '../data/schema'
import { useCommitteeReport } from './committee-report-provider'

type CommitteeReportMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CommitteeReportMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: CommitteeReportMultiDeleteDialogProps<TData>) {
    const { millId } = useCommitteeReport()
    const { mutate: bulkDelete, isPending } = useBulkDeleteCommittees(millId)
    const { t } = useTranslation('mill-staff')
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = (e: React.MouseEvent) => {
        e.preventDefault()
        const ids = selectedRows
            .map((row) => (row.original as CommitteeReportData)._id)
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
                        {t('delete.multiTitle', {
                            count: selectedRows.length,
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('delete.multiDescription')}
                        <br />
                        {t('delete.undone')}
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
