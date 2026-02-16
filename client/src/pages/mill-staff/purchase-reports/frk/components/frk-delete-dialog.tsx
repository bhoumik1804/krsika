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
import { useDeleteFrkPurchase } from '../data/hooks'
import { type FrkPurchaseData } from '../data/schema'
import { useFrk } from './frk-provider'

type FrkDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: FrkPurchaseData | null
}

export function FrkDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: FrkDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useFrk()
    const { mutateAsync: deleteFrkPurchase, isPending: isDeleting } =
        useDeleteFrkPurchase(millId)

    const handleDelete = async () => {
        if (currentRow?._id) {
            try {
                await deleteFrkPurchase(currentRow._id)
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
                        {t('frkPurchase.delete.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('frkPurchase.delete.description', {
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
                            ? t('frkPurchase.delete.deleting')
                            : t('frkPurchase.delete.confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
