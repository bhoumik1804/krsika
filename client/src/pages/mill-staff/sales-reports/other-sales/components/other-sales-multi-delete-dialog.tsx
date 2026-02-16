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
import { useBulkDeleteOtherSales } from '../data/hooks'

type OtherSalesMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OtherSalesMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: OtherSalesMultiDeleteDialogProps<TData>) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const { mutate: bulkDelete, isPending } = useBulkDeleteOtherSales(
        millId || ''
    )
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = () => {
        const ids = selectedRows
            .map((row) => (row.original as any)._id)
            .filter(Boolean)
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
                        {t('otherSales.multiDelete.title', {
                            count: selectedRows.length,
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription
                        dangerouslySetInnerHTML={{
                            __html: t('otherSales.multiDelete.description'),
                        }}
                    />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
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
