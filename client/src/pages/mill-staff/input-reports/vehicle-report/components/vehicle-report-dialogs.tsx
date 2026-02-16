import { VehicleReportActionDialog } from './vehicle-report-action-dialog'
import { VehicleReportDeleteDialog } from './vehicle-report-delete-dialog'
import { useVehicleReport } from './vehicle-report-provider'

export function VehicleReportDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useVehicleReport()

    return (
        <>
            <VehicleReportActionDialog
                key='vehicle-add'
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {currentRow && (
                <>
                    <VehicleReportActionDialog
                        key={`vehicle-edit-${currentRow._id}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />

                    <VehicleReportDeleteDialog
                        key={`vehicle-delete-${currentRow._id}`}
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />
                </>
            )}
        </>
    )
}
