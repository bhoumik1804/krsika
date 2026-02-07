import { usePaddy } from './paddy-provider'
import { PaddyActionDialog } from './paddy-action-dialog'
import { PaddyDeleteDialog } from './paddy-delete-dialog'

export function PaddyDialogs() {
    const { open, setOpen } = usePaddy()

    return (
        <>
            <PaddyActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
            />
            <PaddyDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
            />
        </>
    )
}
