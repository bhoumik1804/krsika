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
import { useDeleteRiceSales } from '../data/hooks'
import { type RiceSales } from '../data/schema'
import { useRiceSales } from './rice-sales-provider'

type RiceSalesDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: RiceSales | null
}

export function RiceSalesDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: RiceSalesDeleteDialogProps) {
    const { t } = useTranslation('millStaff')
    const { millId } = useRiceSales()
    const { mutateAsync: deleteRiceSales, isPending: isDeleting } =
        useDeleteRiceSales(millId)

    const handleDelete = async () => {
        if (currentRow?._id) {
            try {
                await deleteRiceSales(currentRow._id)
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
                        {t('riceSales.delete.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('riceSales.delete.description', {
                            name: currentRow?.partyName,
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
                        {isDeleting ? t('common.deleting') : t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
