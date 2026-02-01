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
import { type DoReportData } from '../data/schema'
import { useDeleteDoReport } from '../data/hooks'
import { useUser } from '@/pages/landing/hooks/use-auth'

type DoReportDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: DoReportData | null
}

export function DoReportDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: DoReportDeleteDialogProps) {
    const { user } = useUser()
    const millId = user?.millId as any
    const deleteMutation = useDeleteDoReport(millId)

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
                        <strong>{currentRow?.doNo}</strong> on <br />
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
