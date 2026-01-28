import { NakkhiOutwardActionDialog } from './nakkhi-outward-action-dialog'
import { NakkhiOutwardDeleteDialog } from './nakkhi-outward-delete-dialog'
import { nakkhiOutward } from './nakkhi-outward-provider'

export function NakkhiOutwardDialogs() {
    const { open, setOpen, currentRow } = nakkhiOutward()

    return (
        <>
            <NakkhiOutwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <NakkhiOutwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
