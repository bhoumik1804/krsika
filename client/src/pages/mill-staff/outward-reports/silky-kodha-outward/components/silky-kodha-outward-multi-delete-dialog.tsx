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
import { useBulkDeleteSilkyKodhaOutward } from '../data/hooks'
import { type SilkyKodhaOutward } from '../data/schema'
import { silkyKodhaOutward } from './silky-kodha-outward-provider'

type SilkyKodhaOutwardMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SilkyKodhaOutwardMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: SilkyKodhaOutwardMultiDeleteDialogProps<TData>) {
    const { t } = useTranslation('mill-staff')
    const { millId } = silkyKodhaOutward()
    const bulkDeleteMutation = useBulkDeleteSilkyKodhaOutward(millId)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = () => {
        const ids = selectedRows
            .map((row) => (row.original as SilkyKodhaOutward)._id)
            .filter((id): id is string => !!id)
        if (!ids.length) return

        toast.promise(bulkDeleteMutation.mutateAsync(ids), {
            loading: t('common.deleting'),
            success: () => {
                table.resetRowSelection()
                onOpenChange(false)
                return t('common.deletedSelectedSuccess', {
                    count: ids.length,
                })
            },
            error: (error) => error.message || t('common.error'),
        })
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
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        {t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
