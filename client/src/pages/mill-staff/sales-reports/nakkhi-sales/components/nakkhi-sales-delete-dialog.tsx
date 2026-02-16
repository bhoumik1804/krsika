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
import { useDeleteNakkhiSales } from '../data/hooks'
import type { NakkhiSalesResponse } from '../data/types'
import { useNakkhiSales } from './nakkhi-sales-provider'

type NakkhiSalesDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: NakkhiSalesResponse | null
}

export function NakkhiSalesDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: NakkhiSalesDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useNakkhiSales()
    const { mutateAsync: deleteNakkhiSales, isPending } =
        useDeleteNakkhiSales(millId)

    const handleDelete = async () => {
        if (!currentRow?._id) return
        try {
            await deleteNakkhiSales(currentRow._id)
            onOpenChange(false)
        } catch (error) {
            // Error handling is managed by mutation hook
            console.error('Delete error:', error)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('nakkhiSales.delete.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription
                        dangerouslySetInnerHTML={{
                            __html: t('nakkhiSales.delete.description', {
                                name: currentRow?.partyName || '',
                            }),
                        }}
                    />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        {t('common.cancel')}
                    </AlertDialogCancel>
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
