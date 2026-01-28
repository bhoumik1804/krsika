import { StockRiceActionDialog } from './stock-rice-action-dialog'
import { StockRiceDeleteDialog } from './stock-rice-delete-dialog'
import { stockRice } from './stock-rice-provider'

export function StockRiceDialogs() {
    const { open, setOpen, currentRow } = stockRice()

    return (
        <>
            <StockRiceActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <StockRiceDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
