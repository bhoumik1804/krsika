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
import { useDeleteOtherSales } from '../data/hooks'
import { type OtherSales } from '../data/schema'

type OtherSalesDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: OtherSales | null
}

export function OtherSalesDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: OtherSalesDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const { mutate: deleteOtherSale, isPending } = useDeleteOtherSales(
        millId || ''
    )

    const handleDelete = () => {
        if (!currentRow?._id) return
        deleteOtherSale(currentRow._id, {
            onSuccess: () => {
                onOpenChange(false)
            },
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('otherSales.delete.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription
                        dangerouslySetInnerHTML={{
                            __html: t('otherSales.delete.description', {
                                name: currentRow?.partyName || '',
                            }),
                        }}
                    />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isPending}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        {isPending ? t('common.deleting') : t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
