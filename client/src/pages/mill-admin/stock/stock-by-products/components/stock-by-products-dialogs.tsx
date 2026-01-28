import { StockByProductsActionDialog } from './stock-by-products-action-dialog'
import { StockByProductsDeleteDialog } from './stock-by-products-delete-dialog'
import { stockByProducts } from './stock-by-products-provider'

export function StockByProductsDialogs() {
    const { open, setOpen, currentRow } = stockByProducts()

    return (
        <>
            <StockByProductsActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <StockByProductsDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
