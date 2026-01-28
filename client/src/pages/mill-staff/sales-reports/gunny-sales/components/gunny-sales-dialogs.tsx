import { GunnySalesActionDialog } from './gunny-sales-action-dialog'
import { GunnySalesDeleteDialog } from './gunny-sales-delete-dialog'
import { gunnySales } from './gunny-sales-provider'

export function GunnySalesDialogs() {
    const { open, setOpen, currentRow } = gunnySales()

    return (
        <>
            <GunnySalesActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <GunnySalesDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
