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
import { useBulkDeletePrivateRiceOutward } from '../data/hooks'
import { type PrivateRiceOutward } from '../data/schema'
import { useOutwardBalanceLiftingRice } from './outward-balance-lifting-rice-provider'

type OutwardBalanceLiftingRiceMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OutwardBalanceLiftingRiceMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: OutwardBalanceLiftingRiceMultiDeleteDialogProps<TData>) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useOutwardBalanceLiftingRice()
    const { mutateAsync: bulkDelete, isPending: isDeleting } =
        useBulkDeletePrivateRiceOutward(millId)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        const ids = selectedRows
            .map((row) => (row.original as PrivateRiceOutward)._id)
            .filter(Boolean) as string[]

        if (ids.length > 0) {
            try {
                await bulkDelete(ids)
                table.resetRowSelection()
                onOpenChange(false)
            } catch (error) {
                console.error('Error deleting entries:', error)
            }
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('balanceLifting.outward.rice.actions.deleteCountTitle', {
                            count: selectedRows.length,
                            entity:
                                selectedRows.length > 1
                                    ? t('balanceLifting.outward.rice.actions.entries')
                                    : t('balanceLifting.outward.rice.actions.entry'),
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t(
                            'balanceLifting.outward.rice.actions.deleteSelectedEntriesConfirm'
                        )}{' '}
                        <br />
                        {t('balanceLifting.outward.rice.actions.cannotUndo')}
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
