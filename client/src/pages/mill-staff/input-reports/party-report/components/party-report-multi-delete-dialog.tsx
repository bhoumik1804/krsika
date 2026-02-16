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
import { useBulkDeleteParties } from '../data/hooks'
import { type PartyReportData } from '../data/schema'
import { usePartyReport } from './party-report-provider'

type PartyReportMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PartyReportMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: PartyReportMultiDeleteDialogProps<TData>) {
    const { millId } = usePartyReport()
    const { mutate: bulkDelete, isPending: isDeleting } =
        useBulkDeleteParties(millId)
    const { t } = useTranslation('mill-staff')
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = (e: React.MouseEvent) => {
        e.preventDefault()
        const ids = selectedRows
            .map((row) => (row.original as PartyReportData)._id)
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
                        {t('multiDelete.title', {
                            count: selectedRows.length,
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: t(
                                    'multiDelete.description'
                                ),
                            }}
                        />
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
                        {isDeleting ? t('common.deleting') : t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
