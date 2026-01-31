import { RiceInwardActionDialog } from './rice-inward-action-dialog'
import { RiceInwardDeleteDialog } from './rice-inward-delete-dialog'
import { riceInward } from './rice-inward-provider'

export function RiceInwardDialogs() {
    const { open, setOpen, currentRow } = riceInward()

    return (
        <>
            <RiceInwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <RiceInwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
