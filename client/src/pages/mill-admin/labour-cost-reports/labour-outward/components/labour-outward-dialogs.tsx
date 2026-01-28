import { LabourOutwardActionDialog } from './labour-outward-action-dialog'
import { LabourOutwardDeleteDialog } from './labour-outward-delete-dialog'
import { labourOutward } from './labour-outward-provider'

export function LabourOutwardDialogs() {
    const { open, setOpen, currentRow } = labourOutward()

    return (
        <>
            <LabourOutwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <LabourOutwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
