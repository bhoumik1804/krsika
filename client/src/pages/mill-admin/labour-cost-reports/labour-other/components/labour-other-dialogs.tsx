import { LabourOtherActionDialog } from './labour-other-action-dialog'
import { LabourOtherDeleteDialog } from './labour-other-delete-dialog'
import { labourOther } from './labour-other-provider'

export function LabourOtherDialogs() {
    const { open, setOpen, currentRow } = labourOther()

    return (
        <>
            <LabourOtherActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <LabourOtherDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
