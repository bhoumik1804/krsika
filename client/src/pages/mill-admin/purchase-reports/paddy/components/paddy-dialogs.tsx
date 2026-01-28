import { PaddyActionDialog } from './paddy-action-dialog'
import { PaddyDeleteDialog } from './paddy-delete-dialog'
import { usePaddy } from './paddy-provider'

export function PaddyDialogs() {
    const { open, setOpen, currentRow } = usePaddy()

    return (
        <>
            <PaddyActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <PaddyDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
