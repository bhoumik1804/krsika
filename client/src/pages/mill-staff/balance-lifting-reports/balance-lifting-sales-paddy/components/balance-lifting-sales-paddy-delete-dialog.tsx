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
import { useTranslation } from 'react-i18next'
import { useDeletePaddySale } from '../data/hooks'
import { type PaddySalesResponse } from '../data/types'

type BalanceLiftingSalesPaddyDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: PaddySalesResponse | null
}

export function BalanceLiftingSalesPaddyDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: BalanceLiftingSalesPaddyDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { mutateAsync: deleteSale, isPending: isDeleting } =
        useDeletePaddySale()

    const handleDelete = async () => {
        if (currentRow?._id) {
            try {
                await deleteSale(currentRow._id)
                onOpenChange(false)
            } catch (error) {
                console.error('Error deleting sale:', error)
            }
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('balanceLifting.sales.paddy.actions.deleteSaleTitle')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('balanceLifting.sales.paddy.actions.deleteSaleMessagePrefix')}{' '}
                        <strong>{currentRow?.partyName}</strong>?
                        <br />
                        {t('balanceLifting.sales.paddy.actions.cannotUndo')}
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
                        {isDeleting ? t('common.deleting') : t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
