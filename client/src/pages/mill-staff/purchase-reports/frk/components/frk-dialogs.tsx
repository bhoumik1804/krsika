import { FrkActionDialog } from './frk-action-dialog'
import { FrkDeleteDialog } from './frk-delete-dialog'
import { useFrk } from './frk-provider'

export function FrkDialogs() {
    const { open, setOpen, currentRow } = useFrk()

    return (
        <>
            <FrkActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <FrkDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
