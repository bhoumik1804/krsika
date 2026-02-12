import { BhusaOutwardActionDialog } from './bhusa-outward-action-dialog'
import { BhusaOutwardDeleteDialog } from './bhusa-outward-delete-dialog'
import { bhusaOutward } from './bhusa-outward-provider'

export function BhusaOutwardDialogs() {
    const { open, setOpen, currentRow, millId } = bhusaOutward()

    return (
        <>
            <BhusaOutwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
                millId={millId}
            />
            <BhusaOutwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
                millId={millId}
            />
        </>
    )
}
