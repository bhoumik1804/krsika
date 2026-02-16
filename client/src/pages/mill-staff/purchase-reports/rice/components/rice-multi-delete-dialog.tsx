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
import { useBulkDeleteRicePurchases } from '../data/hooks'
import { type RicePurchaseData } from '../data/schema'
import { useRice } from './rice-provider'

type RiceMultiDeleteDialogProps = {
    table: Table<RicePurchaseData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function RiceMultiDeleteDialog({
    table,
    open,
    onOpenChange,
}: RiceMultiDeleteDialogProps) {
    const { t } = useTranslation('millStaff')
    const { millId } = useRice()
    const { mutateAsync: bulkDeleteRicePurchases, isPending: isDeleting } =
        useBulkDeleteRicePurchases(millId)

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        try {
            const ids = selectedRows
                .map((row) => (row.original as RicePurchaseData)._id)
                .filter(Boolean) as string[]
            await bulkDeleteRicePurchases(ids)
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
                        {t('ricePurchase.multiDelete.title', {
                            count: selectedRows.length,
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('ricePurchase.multiDelete.description')}
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
                            ? t('ricePurchase.delete.deleting')
                            : t('ricePurchase.delete.confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
