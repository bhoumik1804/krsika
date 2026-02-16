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
import { useBulkDeleteGunnyPurchases } from '../data/hooks'
import { type GunnyPurchaseData } from '../data/schema'
import { useGunny } from './gunny-provider'

type GunnyMultiDeleteDialogProps = {
    table: Table<GunnyPurchaseData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function GunnyMultiDeleteDialog({
    table,
    open,
    onOpenChange,
}: GunnyMultiDeleteDialogProps) {
    const { t } = useTranslation('millStaff')
    const { millId } = useGunny()
    const { mutateAsync: bulkDeleteGunnyPurchases, isPending: isDeleting } =
        useBulkDeleteGunnyPurchases(millId)

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        try {
            const ids = selectedRows
                .map((row) => (row.original as GunnyPurchaseData)._id)
                .filter(Boolean) as string[]
            await bulkDeleteGunnyPurchases(ids)
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
                        {t('gunnyPurchase.multiDelete.title', {
                            count: selectedRows.length,
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('gunnyPurchase.multiDelete.description')}
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
                            ? t('gunnyPurchase.delete.deleting')
                            : t('gunnyPurchase.delete.confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
