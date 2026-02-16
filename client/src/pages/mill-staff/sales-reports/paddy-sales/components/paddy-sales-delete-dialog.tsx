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
import { type PaddySales } from '../data/schema'

type PaddySalesDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PaddySales | null
}

export function PaddySalesDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: PaddySalesDeleteDialogProps) {
    const { t } = useTranslation('millStaff')
    const handleDelete = () => {
        toast.promise(sleep(2000), {
            loading: t('common.deleting', 'Deleting...'),
            success: () => {
                onOpenChange(false)
                return t('common.deletedSuccessfully', 'Deleted successfully')
            },
            error: t('common.errors.failedToDelete', 'Failed to delete'),
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('paddySales.delete.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('paddySales.delete.description', {
                            name: currentRow?.partyName,
                        })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        {t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
