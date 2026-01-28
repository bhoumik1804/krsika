import { GovtPaddyInwardActionDialog } from './govt-paddy-inward-action-dialog'
import { GovtPaddyInwardDeleteDialog } from './govt-paddy-inward-delete-dialog'
import { govtPaddyInward } from './govt-paddy-inward-provider'

export function GovtPaddyInwardDialogs() {
    const { open, setOpen, currentRow } = govtPaddyInward()

    return (
        <>
            <GovtPaddyInwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <GovtPaddyInwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
