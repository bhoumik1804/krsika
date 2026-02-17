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
import { useBulkDeleteGovtGunnyOutward } from '../data/hooks'
import { type GovtGunnyOutward } from '../data/schema'
import { useGovtGunnyOutward } from './govt-gunny-outward-provider'

interface Props<TData> {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function GovtGunnyOutwardMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: Props<TData>) {
    const { t } = useTranslation('mill-staff')
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const { millId } = useGovtGunnyOutward()
    const bulkDeleteMutation = useBulkDeleteGovtGunnyOutward(millId)

    const handleDeleteSelected = () => {
        const ids = selectedRows
            .map((row) => (row.original as GovtGunnyOutward)._id)
            .filter((id): id is string => !!id)
        if (!ids.length) return

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
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                        onClick={handleDeleteSelected}
                    >
                        {t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
