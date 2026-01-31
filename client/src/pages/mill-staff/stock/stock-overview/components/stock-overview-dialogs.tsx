import { StockOverviewActionDialog } from './stock-overview-action-dialog'
import { StockOverviewDeleteDialog } from './stock-overview-delete-dialog'
import { stockOverview } from './stock-overview-provider'

export function StockOverviewDialogs() {
    const { open, setOpen, currentRow } = stockOverview()

    return (
        <>
            <StockOverviewActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <StockOverviewDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
