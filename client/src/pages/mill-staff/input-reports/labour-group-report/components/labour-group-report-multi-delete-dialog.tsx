import { type Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
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
import { useBulkDeleteLabourGroup } from '../data/hooks'
import { type LabourGroupReportData } from '../data/schema'

type LabourGroupReportMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function LabourGroupReportMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: LabourGroupReportMultiDeleteDialogProps<TData>) {
    const { millId } = useParams<{ millId: string }>()
    const { t } = useTranslation('mill-staff')
    const mutation = useBulkDeleteLabourGroup(millId || '')
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        const selectedIds = selectedRows.map(
            (row) => (row.original as LabourGroupReportData)._id as string
        )

        try {
            await mutation.mutateAsync(selectedIds)
            table.resetRowSelection()
            onOpenChange(false)
        } catch (error) {
            // Error handling is managed by the mutation hook
        }
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
                    <AlertDialogCancel disabled={mutation.isPending}>
                        {t('common.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDeleteSelected()
                        }}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending
                            ? t('common.deleting')
                            : t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
