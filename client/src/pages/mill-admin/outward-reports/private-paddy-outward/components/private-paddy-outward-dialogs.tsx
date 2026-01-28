import { PrivatePaddyOutwardActionDialog } from './private-paddy-outward-action-dialog'
import { PrivatePaddyOutwardDeleteDialog } from './private-paddy-outward-delete-dialog'
import { privatePaddyOutward } from './private-paddy-outward-provider'

export function PrivatePaddyOutwardDialogs() {
    const { open, setOpen, currentRow } = privatePaddyOutward()

    return (
        <>
            <PrivatePaddyOutwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <PrivatePaddyOutwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
