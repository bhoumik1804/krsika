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
import { useBulkDeletePaddyPurchases } from '../data/hooks'
import { type PaddyPurchaseData } from '../data/schema'
import { usePaddy } from './paddy-provider'

type PaddyMultiDeleteDialogProps = {
    table: Table<PaddyPurchaseData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PaddyMultiDeleteDialog({
    table,
    open,
    onOpenChange,
}: PaddyMultiDeleteDialogProps) {
    const { t } = useTranslation('millStaff')
    const { millId } = usePaddy()
    const { mutateAsync: bulkDeletePaddyPurchases, isPending: isDeleting } =
        useBulkDeletePaddyPurchases(millId)

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        try {
            const ids = selectedRows
                .map((row) => (row.original as PaddyPurchaseData)._id)
                .filter(Boolean) as string[]
            await bulkDeletePaddyPurchases(ids)
            table.resetRowSelection()
            onOpenChange(false)
        } catch (error) {
            console.error('Error deleting records:', error)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('paddyPurchase.multiDelete.title', {
                            count: selectedRows.length,
                            item: t(`paddyPurchase.multiDelete.item`, {
                                count: selectedRows.length,
                            }),
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('paddyPurchase.multiDelete.description')}
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
                            ? t('paddyPurchase.multiDelete.deleting')
                            : t('paddyPurchase.multiDelete.confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
