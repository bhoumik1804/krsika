import { LabourMillingActionDialog } from './labour-milling-action-dialog'
import { LabourMillingDeleteDialog } from './labour-milling-delete-dialog'
import { labourMilling } from './labour-milling-provider'

export function LabourMillingDialogs() {
    const { open, setOpen, currentRow } = labourMilling()

    return (
        <>
            <LabourMillingActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <LabourMillingDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
