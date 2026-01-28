import { StockOtherActionDialog } from './stock-other-action-dialog'
import { StockOtherDeleteDialog } from './stock-other-delete-dialog'
import { stockGunnyOther } from './stock-other-provider'

export function StockOtherDialogs() {
    const { open, setOpen, currentRow } = stockGunnyOther()

    return (
        <>
            <StockOtherActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <StockOtherDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
