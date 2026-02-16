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
import { useBulkDeleteNakkhiSales } from '../data/hooks'
import type { NakkhiSalesResponse } from '../data/types'
import { useNakkhiSales } from './nakkhi-sales-provider'

type NakkhiSalesMultiDeleteDialogProps = {
    table: Table<NakkhiSalesResponse>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function NakkhiSalesMultiDeleteDialog({
    table,
    open,
    onOpenChange,
}: NakkhiSalesMultiDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useNakkhiSales()
    const { mutateAsync: bulkDeleteNakkhiSales, isPending } =
        useBulkDeleteNakkhiSales(millId)

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        const ids = selectedRows.map((row) => row.original._id)
        try {
            await bulkDeleteNakkhiSales(ids)
            table.resetRowSelection()
            onOpenChange(false)
        } catch (error) {
            // Error handling is managed by mutation hook
            console.error('Bulk delete error:', error)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('nakkhiSales.multiDelete.title', {
                            count: selectedRows.length,
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription
                        dangerouslySetInnerHTML={{
                            __html: t('nakkhiSales.multiDelete.description'),
                        }}
                    />
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
