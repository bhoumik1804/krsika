import { PrivateRiceOutwardActionDialog } from './private-rice-outward-action-dialog'
import { PrivateRiceOutwardDeleteDialog } from './private-rice-outward-delete-dialog'
import { usePrivateRiceOutward } from './private-rice-outward-provider'

export function PrivateRiceOutwardDialogs() {
    const { open, setOpen, currentRow } = usePrivateRiceOutward()

    return (
        <>
            <PrivateRiceOutwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <PrivateRiceOutwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
