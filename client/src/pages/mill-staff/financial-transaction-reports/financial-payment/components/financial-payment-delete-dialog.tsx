import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
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
import { useDeleteFinancialPayment } from '../data/hooks'
import { type FinancialPayment } from '../data/schema'

type FinancialPaymentDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: FinancialPayment | null
}

export function FinancialPaymentDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: FinancialPaymentDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const deleteMutation = useDeleteFinancialPayment()

    const handleDelete = () => {
        if (currentRow && currentRow._id) {
            deleteMutation.mutate(
                { millId: millId || '', id: currentRow._id },
                {
                    onSuccess: () => {
                        onOpenChange(false)
                    },
                }
            )
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('delete.title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('delete.description')}
                        {currentRow?.partyName && (
                            <>
                                <br />
                                <strong>{currentRow.partyName}</strong>
                            </>
                        )}
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
