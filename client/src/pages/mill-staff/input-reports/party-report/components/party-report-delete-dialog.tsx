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
                    <AlertDialogTitle>Delete Record?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this record for{' '}
                        <strong>{currentRow.partyName}</strong>?
                        <br />
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
