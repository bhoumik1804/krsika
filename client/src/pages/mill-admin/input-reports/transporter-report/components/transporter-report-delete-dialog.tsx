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
import { useDeleteTransporter } from '../data/hooks'
import { type TransporterReportData } from '../data/schema'
import { useTransporterReport } from './transporter-report-provider'

type TransporterReportDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: TransporterReportData | null
}

export function TransporterReportDeleteDialog({
    open,
    onOpenChange,
}: TransporterReportDeleteDialogProps) {
    const { currentRow, millId } = useTransporterReport()
    const { mutate: deleteTransporter, isPending: isDeleting } =
        useDeleteTransporter(millId)

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent default AlertDialog close behavior
        if (currentRow?.id) {
            deleteTransporter(currentRow.id, {
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
                        <strong>{currentRow?.transporterName}</strong>?
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
