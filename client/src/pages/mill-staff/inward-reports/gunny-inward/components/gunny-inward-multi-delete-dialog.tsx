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
import { useBulkDeleteGunnyInward } from '../data/hooks'
import { type GunnyInward } from '../data/types'
import { gunnyInward } from './gunny-inward-provider'

type GunnyInwardMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function GunnyInwardMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: GunnyInwardMultiDeleteDialogProps<TData>) {
    const { t } = useTranslation('mill-staff')
    const { millId } = gunnyInward()
    const { mutate: bulkDelete, isPending } = useBulkDeleteGunnyInward(millId)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = () => {
        const ids = selectedRows
            .map((row) => (row.original as GunnyInward)._id)
            .filter((id): id is string => Boolean(id))

        if (ids.length === 0) return

        bulkDelete(ids, {
            onSuccess: () => {
                table.resetRowSelection()
                onOpenChange(false)
            },
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('common.deleteCount', {
                            count: selectedRows.length,
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('common.bulkDeleteConfirmation')}
                        <br />
                        {t('common.cannotBeUndone')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        {t('common.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteSelected}
                        disabled={isPending}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        {isPending ? t('common.deleting') : t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
