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
import { useBulkDeleteGunnySales } from '../data/hooks'
import type { GunnySalesResponse } from '../data/types'
import { useGunnySales } from './gunny-sales-provider'

type GunnySalesMultiDeleteDialogProps = {
    table: Table<GunnySalesResponse>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function GunnySalesMultiDeleteDialog({
    table,
    open,
    onOpenChange,
}: GunnySalesMultiDeleteDialogProps) {
    const { t } = useTranslation('millStaff')
    const { millId } = useGunnySales()
    const { mutateAsync: bulkDeleteGunnySales, isPending } =
        useBulkDeleteGunnySales(millId)

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        const ids = selectedRows.map((row) => row.original._id)
        try {
            await bulkDeleteGunnySales(ids)
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
                        {t('gunnySales.multiDelete.title', {
                            count: selectedRows.length,
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: t('gunnySales.multiDelete.description'),
                            }}
                        />
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
