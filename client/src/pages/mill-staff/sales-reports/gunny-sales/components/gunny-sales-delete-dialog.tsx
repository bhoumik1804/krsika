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
import { useDeleteGunnySales } from '../data/hooks'
import type { GunnySalesResponse } from '../data/types'
import { useGunnySales } from './gunny-sales-provider'

type GunnySalesDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: GunnySalesResponse | null
}

export function GunnySalesDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: GunnySalesDeleteDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useGunnySales()
    const { mutateAsync: deleteGunnySales, isPending } =
        useDeleteGunnySales(millId)

    const handleDelete = async () => {
        if (!currentRow?._id) return
        try {
            await deleteGunnySales(currentRow._id)
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
                        {t('gunnySales.delete.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: t('gunnySales.delete.description', {
                                    name: currentRow?.partyName || '',
                                }),
                            }}
                        />
                    </AlertDialogDescription>
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
