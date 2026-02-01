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
import { type TransporterReportData } from '../data/schema'
import { useDeleteTransporter } from '../data/hooks'
import { useUser } from '@/pages/landing/hooks/use-auth'

type TransporterReportDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: TransporterReportData | null
}

export function TransporterReportDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: TransporterReportDeleteDialogProps) {
    const { user } = useUser()
    const millId = user?.millId as any
    const deleteMutation = useDeleteTransporter(millId)

    const handleDelete = async () => {
        if (!currentRow?._id) return
        
        try {
            await deleteMutation.mutateAsync(currentRow._id)
            onOpenChange(false)
        } catch (error: any) {
            console.error('Delete error:', error)
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
                    <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
