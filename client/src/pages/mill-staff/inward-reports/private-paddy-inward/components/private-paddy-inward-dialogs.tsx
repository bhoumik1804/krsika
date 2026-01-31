import { PrivatePaddyInwardActionDialog } from './private-paddy-inward-action-dialog'
import { PrivatePaddyInwardDeleteDialog } from './private-paddy-inward-delete-dialog'
import { privatePaddyInward } from './private-paddy-inward-provider'

export function PrivatePaddyInwardDialogs() {
    const { open, setOpen, currentRow } = privatePaddyInward()

    return (
        <>
            <PrivatePaddyInwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <PrivatePaddyInwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
