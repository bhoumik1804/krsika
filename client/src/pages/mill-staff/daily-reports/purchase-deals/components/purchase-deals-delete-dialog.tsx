// purchase-deals-delete-dialog.tsx
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
import { type PurchaseDeal } from '../data/schema'

type PurchaseDealsDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PurchaseDeal | null
}

export function PurchaseDealsDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: PurchaseDealsDeleteDialogProps) {
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
                        {t('dailyReports.delete.description', {
                            name: currentRow?.farmerName,
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
