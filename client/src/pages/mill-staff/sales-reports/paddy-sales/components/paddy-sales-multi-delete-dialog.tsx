import { type Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
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

type PaddySalesMultiDeleteDialogProps<TData> = {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PaddySalesMultiDeleteDialog<TData>({
    table,
    open,
    onOpenChange,
}: PaddySalesMultiDeleteDialogProps<TData>) {
    const { t } = useTranslation('millStaff')
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = () => {
        toast.promise(sleep(2000), {
            loading: t('common.deleting', 'Deleting...'),
            success: () => {
                table.resetRowSelection()
                onOpenChange(false)
                return t('common.multiDeletedSuccessfully', {
                    count: selectedRows.length,
                })
            },
            error: t('common.errors.failedToDelete', 'Error deleting records'),
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('paddySales.multiDelete.title', {
                            count: selectedRows.length,
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('paddySales.multiDelete.description')}
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
