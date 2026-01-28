import { PaddySalesActionDialog } from './paddy-sales-action-dialog'
import { PaddySalesDeleteDialog } from './paddy-sales-delete-dialog'
import { paddySales } from './paddy-sales-provider'

export function PaddySalesDialogs() {
    const { open, setOpen, currentRow } = paddySales()

    return (
        <>
            <PaddySalesActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <PaddySalesDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
