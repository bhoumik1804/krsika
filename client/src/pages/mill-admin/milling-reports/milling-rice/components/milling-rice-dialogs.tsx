import { MillingRiceActionDialog } from './milling-rice-action-dialog'
import { MillingRiceDeleteDialog } from './milling-rice-delete-dialog'
import { millingRice } from './milling-rice-provider'

export function MillingRiceDialogs() {
    const { open, setOpen, currentRow } = millingRice()

    return (
        <>
            <MillingRiceActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <MillingRiceDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
