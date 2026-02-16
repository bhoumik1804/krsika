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
import { useDeleteVehicle } from '../data/hooks'
import { type VehicleReportData } from '../data/schema'
import { useVehicleReport } from './vehicle-report-provider'

type VehicleReportDeleteDialogProps = {
    currentRow: VehicleReportData
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function VehicleReportDeleteDialog({
    currentRow,
    open,
    onOpenChange,
}: VehicleReportDeleteDialogProps) {
    const { millId } = useVehicleReport()
    const { mutate: deleteVehicle, isPending: isDeleting } =
        useDeleteVehicle(millId)
    const { t } = useTranslation('mill-staff')

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        const vehicleId = currentRow._id
        if (vehicleId) {
            deleteVehicle(vehicleId, {
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
                        {t('delete.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('delete.descriptionItem')}{' '}
                        <strong>{currentRow.truckNo}</strong>?
                        <br />
                        {t('delete.undone')}
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
                        {isDeleting ? t('common.loading') : t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
