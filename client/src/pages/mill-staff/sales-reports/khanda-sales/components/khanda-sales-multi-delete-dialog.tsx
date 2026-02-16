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
import { useBulkDeleteKhandaSales } from '../data/hooks'
import type { KhandaSalesResponse } from '../data/types'
import { useKhandaSales } from './khanda-sales-provider'

type KhandaSalesMultiDeleteDialogProps = {
    table: Table<KhandaSalesResponse>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function KhandaSalesMultiDeleteDialog({
    table,
    open,
    onOpenChange,
}: KhandaSalesMultiDeleteDialogProps) {
    const { t } = useTranslation('millStaff')
    const { millId } = useKhandaSales()
    const { mutateAsync: bulkDeleteKhandaSales, isPending } =
        useBulkDeleteKhandaSales(millId)

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        const ids = selectedRows.map((row) => row.original._id)
        try {
            await bulkDeleteKhandaSales(ids)
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
                        {t('khandaSales.multiDelete.title', {
                            count: selectedRows.length,
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: t(
                                    'khandaSales.multiDelete.description'
                                ),
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
