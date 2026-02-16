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
import { useDeleteGunnyPurchase } from '../data/hooks'
import { type GunnyPurchaseData } from '../data/schema'
import { useGunny } from './gunny-provider'

type GunnyDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: GunnyPurchaseData | null
}

export function GunnyDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: GunnyDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useGunny()
    const { mutateAsync: deleteGunnyPurchase, isPending: isDeleting } =
        useDeleteGunnyPurchase(millId)

    const handleDelete = async () => {
        if (currentRow?._id) {
            try {
                await deleteGunnyPurchase(currentRow._id)
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
                        {t('gunnyPurchase.delete.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('gunnyPurchase.delete.description', {
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
                            ? t('gunnyPurchase.delete.deleting')
                            : t('gunnyPurchase.delete.confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
