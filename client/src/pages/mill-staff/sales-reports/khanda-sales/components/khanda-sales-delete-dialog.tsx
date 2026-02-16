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
import { useDeleteKhandaSales } from '../data/hooks'
import type { KhandaSalesResponse } from '../data/types'
import { useKhandaSales } from './khanda-sales-provider'

type KhandaSalesDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: KhandaSalesResponse | null
}

export function KhandaSalesDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: KhandaSalesDeleteDialogProps) {
    const { t } = useTranslation('millStaff')
    const { millId } = useKhandaSales()
    const { mutateAsync: deleteKhandaSales, isPending } =
        useDeleteKhandaSales(millId)

    const handleDelete = async () => {
        if (!currentRow?._id) return
        try {
            await deleteKhandaSales(currentRow._id)
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
                        {t('khandaSales.delete.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: t('khandaSales.delete.description', {
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
