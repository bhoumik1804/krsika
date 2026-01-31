import { KodhaOutwardActionDialog } from './kodha-outward-action-dialog'
import { KodhaOutwardDeleteDialog } from './kodha-outward-delete-dialog'
import { kodhaOutward } from './kodha-outward-provider'

export function KodhaOutwardDialogs() {
    const { open, setOpen, currentRow } = kodhaOutward()

    return (
        <>
            <KodhaOutwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <KodhaOutwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
