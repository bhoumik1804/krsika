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
import { useDeleteParty } from '../data/hooks'
import { type PartyReportData } from '../data/schema'
import { usePartyReport } from './party-report-provider'

type PartyReportDeleteDialogProps = {
    currentRow: PartyReportData
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PartyReportDeleteDialog({
    currentRow,
    open,
    onOpenChange,
}: PartyReportDeleteDialogProps) {
    const { millId } = usePartyReport()
    const { mutate: deleteParty, isPending: isDeleting } =
        useDeleteParty(millId)
    const { t } = useTranslation('mill-staff')

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        const partyId = currentRow._id
        if (partyId) {
            deleteParty(partyId, {
                onSuccess: () => {
                    onOpenChange(false)
                },
            })
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('inputReports.delete.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: t('inputReports.delete.description', {
                                    name: currentRow.partyName,
                                }),
                            }}
                        />
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
