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
import { useDeleteBroker } from '../data/hooks'
import { type BrokerReportData } from '../data/schema'
import { useBrokerReport } from './broker-report-provider'

type BrokerReportDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: BrokerReportData | null
}

export function BrokerReportDeleteDialog({
    open,
    onOpenChange,
}: BrokerReportDeleteDialogProps) {
    const { currentRow, millId } = useBrokerReport()
    const { mutate: deleteBroker, isPending: isDeleting } =
        useDeleteBroker(millId)

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent default AlertDialog close behavior
        if (currentRow?.id) {
            deleteBroker(currentRow.id, {
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
                        <strong>{currentRow?.brokerName}</strong>?
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
