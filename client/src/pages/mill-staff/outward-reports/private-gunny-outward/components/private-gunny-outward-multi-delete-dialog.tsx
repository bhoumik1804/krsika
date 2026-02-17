import { Table } from '@tanstack/react-table'
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
import { useBulkDeletePrivateGunnyOutward } from '../data/hooks'
import { PrivateGunnyOutward } from '../data/schema'
import { usePrivateGunnyOutward } from './private-gunny-outward-provider'

interface Props<TData> {
    open: boolean
    onOpenChange: (open: boolean) => void
    table: Table<TData>
}

export function PrivateGunnyOutwardMultiDeleteDialog<TData>({
    open,
    onOpenChange,
    table,
}: Props<TData>) {
    const { t } = useTranslation('mill-staff')
    const { millId } = usePrivateGunnyOutward()
    const bulkDeleteMutation = useBulkDeletePrivateGunnyOutward(millId)

    const handleBulkDelete = () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows
        const ids = selectedRows.map(
            (row) => (row.original as PrivateGunnyOutward)._id
        )

        if (ids.length === 0) return

        toast.promise(bulkDeleteMutation.mutateAsync(ids), {
            loading: t('common.deleting'),
            success: () => {
                table.resetRowSelection()
                onOpenChange(false)
                return t('common.deletedSelectedSuccess', {
                    count: selectedRows.length,
                })
            },
            error: t('common.error'),
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('common.deleteSelectedTitle', {
                            count: table.getFilteredSelectedRowModel().rows
                                .length,
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('common.deleteSelectedDescription')}
                        <br />
                        {t('common.actionCannotBeUndone')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                        onClick={handleBulkDelete}
                    >
                        {t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
