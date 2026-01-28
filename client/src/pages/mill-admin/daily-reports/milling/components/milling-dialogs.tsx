import { MillingActionDialog } from './milling-action-dialog'
import { MillingDeleteDialog } from './milling-delete-dialog'
import { useMilling } from './milling-provider'

export function MillingDialogs() {
    const { open, setOpen, currentRow } = useMilling()

    return (
        <>
            <MillingActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <MillingDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
