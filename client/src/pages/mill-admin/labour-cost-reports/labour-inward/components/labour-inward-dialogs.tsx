import { LabourInwardActionDialog } from './labour-inward-action-dialog'
import { LabourInwardDeleteDialog } from './labour-inward-delete-dialog'
import { labourInward } from './labour-inward-provider'

export function LabourInwardDialogs() {
    const { open, setOpen, currentRow } = labourInward()

    return (
        <>
            <LabourInwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <LabourInwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
