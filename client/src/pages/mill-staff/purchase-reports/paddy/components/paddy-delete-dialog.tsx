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
import { useDeletePaddyPurchase } from '../data/hooks'
import { type PaddyPurchaseData } from '../data/schema'
import { usePaddy } from './paddy-provider'

type PaddyDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PaddyPurchaseData | null
}

export function PaddyDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: PaddyDeleteDialogProps) {
    const { t } = useTranslation('millStaff')
    const { millId } = usePaddy()
    const { mutateAsync: deletePaddyPurchase, isPending: isDeleting } =
        useDeletePaddyPurchase(millId)

    const handleDelete = async () => {
        if (currentRow?._id) {
            try {
                await deletePaddyPurchase(currentRow._id)
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
                        {t('paddyPurchase.delete.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('paddyPurchase.delete.description', {
                            partyName: currentRow?.partyName,
                            interpolation: { escapeValue: false },
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
                            ? t('paddyPurchase.delete.deleting')
                            : t('paddyPurchase.delete.confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
