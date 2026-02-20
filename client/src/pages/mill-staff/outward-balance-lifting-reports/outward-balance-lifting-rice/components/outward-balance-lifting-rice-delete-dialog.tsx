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
import { useDeletePrivateRiceOutward } from '../data/hooks'
import { type PrivateRiceOutward } from '../data/schema'
import { useOutwardBalanceLiftingRice } from './outward-balance-lifting-rice-provider'

type OutwardBalanceLiftingRiceDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: PrivateRiceOutward | null
}

export function OutwardBalanceLiftingRiceDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: OutwardBalanceLiftingRiceDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useOutwardBalanceLiftingRice()
    const { mutateAsync: deleteEntry, isPending: isDeleting } =
        useDeletePrivateRiceOutward(millId)

    const handleDelete = async () => {
        if (currentRow?._id) {
            try {
                await deleteEntry(currentRow._id)
                onOpenChange(false)
            } catch (error) {
                console.error('Error deleting entry:', error)
            }
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('balanceLifting.outward.rice.actions.deleteEntryTitle')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('balanceLifting.outward.rice.actions.deleteEntryMessagePrefix')}{' '}
                        <strong>{currentRow?.partyName}</strong>?
                        <br />
                        {t('balanceLifting.outward.rice.actions.cannotUndo')}
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
