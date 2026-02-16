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
import { type PaymentEntry } from '../data/schema'

type PaymentDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PaymentEntry | null
}

export function PaymentDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: PaymentDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')

    const handleDelete = () => {
        toast.promise(sleep(2000), {
            loading: t('dailyReports.delete.loading'),
            success: () => {
                onOpenChange(false)
                return t('dailyReports.delete.success')
            },
            error: t('dailyReports.delete.error'),
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('dailyReports.delete.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('dailyReports.delete.descriptionWithVoucher', {
                            name: currentRow?.partyName,
                            voucher: currentRow?.voucherNumber,
                        })}
                        <br />
                        {t('common.actionCannotBeUndone')}
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
