import { useUser } from '@/pages/landing/hooks/use-auth'
import { useParams } from 'react-router'
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
import { useDeleteVehicle } from '../data/hooks'
import { type VehicleReportData } from '../data/schema'

type VehicleReportDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: VehicleReportData | null
}

export function VehicleReportDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: VehicleReportDeleteDialogProps) {
    const { user } = useUser()
    const { millId: routeMillId } = useParams<{ millId: string }>()
    const millId = user?.millId || routeMillId || ''
    const deleteMutation = useDeleteVehicle(millId)

    const handleDelete = async () => {
        if (!currentRow?._id || !millId) return

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
                        <strong>{currentRow?.truckNo}</strong>?
                        <br />
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteMutation.isPending}>
                        Cancel
                    </AlertDialogCancel>
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
