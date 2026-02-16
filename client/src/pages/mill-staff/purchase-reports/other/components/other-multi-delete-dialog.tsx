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
import { useBulkDeleteOtherPurchases } from '../data/hooks'
import { type OtherPurchase } from '../data/schema'
import { useOther } from './other-provider'

type OtherMultiDeleteDialogProps = {
    table: Table<OtherPurchase>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OtherMultiDeleteDialog({
    table,
    open,
    onOpenChange,
}: OtherMultiDeleteDialogProps) {
    const { t } = useTranslation('millStaff')
    const { millId } = useOther()
    const { mutateAsync: bulkDeleteOtherPurchases, isPending: isDeleting } =
        useBulkDeleteOtherPurchases(millId)

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        try {
            const ids = selectedRows
                .map((row) => row.original._id)
                .filter(Boolean) as string[]
            await bulkDeleteOtherPurchases(ids)
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
                        {t('otherPurchase.multiDelete.title', {
                            count: selectedRows.length,
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('otherPurchase.multiDelete.description')}
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
                            ? t('otherPurchase.delete.deleting')
                            : t('otherPurchase.delete.confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
