import { type Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
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
import { useBulkDeletePrivatePaddyOutward } from '../data/hooks'
import { PrivatePaddyOutward } from '../data/schema'

type PrivatePaddyOutwardMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PrivatePaddyOutwardMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: PrivatePaddyOutwardMultiDeleteDialogProps<TData>) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const bulkDeleteMutation = useBulkDeletePrivatePaddyOutward(millId || '')
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = () => {
        const ids = selectedRows
            .map((row) => (row.original as PrivatePaddyOutward)._id)
            .filter((id): id is string => id !== undefined)

        if (ids.length === 0) return

        toast.promise(bulkDeleteMutation.mutateAsync(ids), {
            loading: t('common.deleting'),
            success: () => {
                table.resetRowSelection()
                onOpenChange(false)
                return t('common.deletedSelectedSuccess', {
                    count: ids.length,
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
