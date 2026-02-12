import { OtherOutwardActionDialog } from './other-outward-action-dialog'
import { OtherOutwardDeleteDialog } from './other-outward-delete-dialog'
import { otherOutward } from './other-outward-provider'

export function OtherOutwardDialogs() {
    const { open, setOpen, currentRow, millId } = otherOutward()

    return (
        <>
            <OtherOutwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
                millId={millId}
            />
            <OtherOutwardDeleteDialog
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
