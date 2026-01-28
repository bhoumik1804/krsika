import { SilkyKodhaOutwardActionDialog } from './silky-kodha-outward-action-dialog'
import { SilkyKodhaOutwardDeleteDialog } from './silky-kodha-outward-delete-dialog'
import { silkyKodhaOutward } from './silky-kodha-outward-provider'

export function SilkyKodhaOutwardDialogs() {
    const { open, setOpen, currentRow } = silkyKodhaOutward()

    return (
        <>
            <SilkyKodhaOutwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <SilkyKodhaOutwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
