import { type Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
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
import { useBulkDeleteFrkOutward } from '../data/hooks'
import { useFrkOutward } from './frk-outward-provider'

type FrkOutwardMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function FrkOutwardMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: FrkOutwardMultiDeleteDialogProps<TData>) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useFrkOutward()
    const bulkDeleteMutation = useBulkDeleteFrkOutward()
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = () => {
        const ids = selectedRows.map((row) => (row.original as any)._id)
        if (ids.length === 0) return

        toast.promise(
            bulkDeleteMutation.mutateAsync({
                millId,
                ids,
            }),
            {
                loading: t('common.deleting'),
                success: () => {
                    table.resetRowSelection()
                    onOpenChange(false)
                    return t('common.deletedSelectedSuccess', {
                        count: selectedRows.length,
                    })
                },
                error: t('common.error'),
            }
        )
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('common.deleteSelectedTitle', {
                            count: selectedRows.length,
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('common.deleteSelectedDescription')} <br />
                        {t('common.actionCannotBeUndone')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteSelected}
                        disabled={bulkDeleteMutation.isPending}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        {t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
