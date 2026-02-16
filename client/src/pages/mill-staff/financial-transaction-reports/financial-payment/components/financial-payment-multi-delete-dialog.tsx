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
import { useBulkDeleteFinancialPayment } from '../data/hooks'
import { FinancialPayment } from '../data/schema'

type FinancialPaymentMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function FinancialPaymentMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: FinancialPaymentMultiDeleteDialogProps<TData>) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const { mutate: bulkDelete, isPending } = useBulkDeleteFinancialPayment()

    const handleDeleteSelected = () => {
        const ids = selectedRows
            .map((row) => (row.original as FinancialPayment)._id)
            .filter(Boolean) as string[]

        if (ids.length === 0) return

        bulkDelete(
            { millId: millId || '', ids },
            {
                onSuccess: () => {
                    table.resetRowSelection()
                    onOpenChange(false)
                },
            }
        )
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('delete.bulkTitle')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('delete.bulkDescription', {
                            count: selectedRows.length,
                        })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        {t('common.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDeleteSelected()
                        }}
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
