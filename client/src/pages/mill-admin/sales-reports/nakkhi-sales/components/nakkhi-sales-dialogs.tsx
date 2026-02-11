import { NakkhiSalesActionDialog } from './nakkhi-sales-action-dialog'
import { NakkhiSalesDeleteDialog } from './nakkhi-sales-delete-dialog'
import { useNakkhiSales } from './nakkhi-sales-provider'

export function NakkhiSalesDialogs() {
    const { open, setOpen, currentRow } = useNakkhiSales()

    return (
        <>
            <NakkhiSalesActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <NakkhiSalesDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
