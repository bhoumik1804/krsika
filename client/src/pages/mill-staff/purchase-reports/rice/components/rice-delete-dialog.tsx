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
import { useDeleteRicePurchase } from '../data/hooks'
import { useRice } from './rice-provider'

type RiceDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function RiceDeleteDialog({
    open,
    onOpenChange,
}: RiceDeleteDialogProps) {
    const { currentRow, millId } = useRice()
    const { t } = useTranslation('millStaff')
    const { mutateAsync: deleteRicePurchase, isPending: isDeleting } =
        useDeleteRicePurchase(millId)

    const handleDelete = async () => {
        if (currentRow?._id) {
            try {
                await deleteRicePurchase(currentRow._id)
                onOpenChange(false)
            } catch (error) {
                console.error('Error deleting purchase:', error)
            }
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('ricePurchase.delete.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('ricePurchase.delete.description', {
                            partyName: currentRow?.partyName,
                            date: currentRow?.date,
                        })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        {t('common.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        {isDeleting
                            ? t('ricePurchase.delete.deleting')
                            : t('ricePurchase.delete.confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
