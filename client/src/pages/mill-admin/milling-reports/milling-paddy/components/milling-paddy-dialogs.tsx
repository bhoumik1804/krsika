import { MillingPaddyActionDialog } from './milling-paddy-action-dialog'
import { MillingPaddyDeleteDialog } from './milling-paddy-delete-dialog'
import { millingPaddy } from './milling-paddy-provider'

export function MillingPaddyDialogs() {
    const { open, setOpen, currentRow } = millingPaddy()

    return (
        <>
            <MillingPaddyActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <MillingPaddyDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
