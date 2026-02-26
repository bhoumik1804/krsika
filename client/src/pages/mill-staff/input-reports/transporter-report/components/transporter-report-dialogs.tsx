import { TransporterReportActionDialog } from './transporter-report-action-dialog'
import { TransporterReportDeleteDialog } from './transporter-report-delete-dialog'
import { useTransporterReport } from './transporter-report-provider'

export function TransporterReportDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useTransporterReport()

    return (
        <>
            <TransporterReportActionDialog
                key='transporter-add'
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {currentRow && (
                <>
                    <TransporterReportActionDialog
                        key={`transporter-edit-${currentRow._id}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />

                    <TransporterReportDeleteDialog
                        key={`transporter-delete-${currentRow._id}`}
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
