import { StockPaddyActionDialog } from './stock-paddy-action-dialog'
import { StockPaddyDeleteDialog } from './stock-paddy-delete-dialog'
import { stockPaddy } from './stock-paddy-provider'

export function StockPaddyDialogs() {
    const { open, setOpen, currentRow } = stockPaddy()

    return (
        <>
            <StockPaddyActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <StockPaddyDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
