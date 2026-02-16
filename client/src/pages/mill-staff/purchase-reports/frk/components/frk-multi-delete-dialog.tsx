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
import { useBulkDeleteFrkPurchases } from '../data/hooks'
import { type FrkPurchaseData } from '../data/schema'
import { useFrk } from './frk-provider'

type FrkMultiDeleteDialogProps = {
    table: Table<FrkPurchaseData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function FrkMultiDeleteDialog({
    table,
    open,
    onOpenChange,
}: FrkMultiDeleteDialogProps) {
    const { t } = useTranslation('millStaff')
    const { millId } = useFrk()
    const { mutateAsync: bulkDeleteFrkPurchases, isPending: isDeleting } =
        useBulkDeleteFrkPurchases(millId)

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        try {
            const ids = selectedRows
                .map((row) => (row.original as FrkPurchaseData)._id)
                .filter(Boolean) as string[]
            await bulkDeleteFrkPurchases(ids)
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
                        {t('frkPurchase.multiDelete.title', {
                            count: selectedRows.length,
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('frkPurchase.multiDelete.description')}
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
                            ? t('frkPurchase.delete.deleting')
                            : t('frkPurchase.delete.confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
