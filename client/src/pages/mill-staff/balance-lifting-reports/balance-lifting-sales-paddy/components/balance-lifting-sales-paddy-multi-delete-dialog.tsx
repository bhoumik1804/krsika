import { type Table } from '@tanstack/react-table'
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
import { useTranslation } from 'react-i18next'
import { useDeleteBulkPaddySales } from '../data/hooks'
import { type PaddySalesResponse } from '../data/types'

type PaddySalesMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PaddySalesMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: PaddySalesMultiDeleteDialogProps<TData>) {
    const { t } = useTranslation('mill-staff')
    const { mutateAsync: bulkDelete, isPending: isDeleting } =
        useDeleteBulkPaddySales()
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        const saleIds = selectedRows
            .map((row) => (row.original as PaddySalesResponse)._id)
            .filter(Boolean) as string[]

        if (saleIds.length > 0) {
            try {
                await bulkDelete(saleIds)
                table.resetRowSelection()
                onOpenChange(false)
            } catch (error) {
                console.error('Error deleting sales:', error)
            }
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('balanceLifting.sales.paddy.actions.deleteCountTitle', {
                            count: selectedRows.length,
                            entity:
                                selectedRows.length > 1
                                    ? t('balanceLifting.sales.paddy.actions.sales')
                                    : t('balanceLifting.sales.paddy.actions.sale'),
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t(
                            'balanceLifting.sales.paddy.actions.deleteSelectedSalesConfirm'
                        )}{' '}
                        <br />
                        {t('balanceLifting.sales.paddy.actions.cannotUndo')}
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
