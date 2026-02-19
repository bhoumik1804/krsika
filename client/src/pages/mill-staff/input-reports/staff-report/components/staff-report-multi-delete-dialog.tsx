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
import { useBulkDeleteStaff } from '../data/hooks'
import { type StaffReportData } from '../data/schema'
import { useStaffReport } from './staff-report-provider'

type StaffReportMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function StaffReportMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: StaffReportMultiDeleteDialogProps<TData>) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useStaffReport()
    const { mutate: bulkDelete, isPending: isDeleting } =
        useBulkDeleteStaff(millId)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = (e: React.MouseEvent) => {
        e.preventDefault()
        const ids = selectedRows
            .map((row) => (row.original as StaffReportData)._id)
            .filter((id): id is string => !!id)

        if (ids.length === 0) return

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
                        {t('common.delete')} {selectedRows.length}{' '}
                        {selectedRows.length > 1
                            ? t('common.records')
                            : t('common.record')}
                        ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('common.deleteConfirmationMulti')}
                        <br />
                        {t('common.uCannotUndo')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        {t('common.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteSelected}
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
