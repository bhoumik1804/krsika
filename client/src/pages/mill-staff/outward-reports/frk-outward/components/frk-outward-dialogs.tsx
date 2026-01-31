import { FrkOutwardActionDialog } from './frk-outward-action-dialog'
import { FrkOutwardDeleteDialog } from './frk-outward-delete-dialog'
import { frkOutward } from './frk-outward-provider'

export function FrkOutwardDialogs() {
    const { open, setOpen, currentRow } = frkOutward()

    return (
        <>
            <FrkOutwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <FrkOutwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
