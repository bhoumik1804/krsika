import { FrkOutwardActionDialog } from './frk-outward-action-dialog'
import { FrkOutwardDeleteDialog } from './frk-outward-delete-dialog'
import { useFrkOutward } from './frk-outward-provider'

export function FrkOutwardDialogs() {
    const { open, setOpen } = useFrkOutward()

    return (
        <>
            <FrkOutwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
            />
            <FrkOutwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
            />
        </>
    )
}
