import { OtherSalesActionDialog } from './other-sales-action-dialog'
import { OtherSalesDeleteDialog } from './other-sales-delete-dialog'
import { otherSales } from './other-sales-provider'

export function OtherSalesDialogs() {
    const { open, setOpen, currentRow } = otherSales()

    return (
        <>
            <OtherSalesActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <OtherSalesDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
