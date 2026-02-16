import { OtherSalesActionDialog } from './other-sales-action-dialog'
import { OtherSalesDeleteDialog } from './other-sales-delete-dialog'
import { useOtherSales } from './other-sales-provider'

export function OtherSalesDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useOtherSales()

    return (
        <>
            <OtherSalesActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) => {
                    setOpen(isOpen ? open : null)
                    if (!isOpen) {
                        setTimeout(() => setCurrentRow(null), 200)
                    }
                }}
                currentRow={open === 'edit' ? currentRow : null}
            />
            <OtherSalesDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) => {
                    setOpen(isOpen ? 'delete' : null)
                    if (!isOpen) {
                        setTimeout(() => setCurrentRow(null), 200)
                    }
                }}
                currentRow={currentRow}
            />
        </>
    )
}
