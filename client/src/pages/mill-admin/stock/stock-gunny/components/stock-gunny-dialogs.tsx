import { StockGunnyActionDialog } from './stock-gunny-action-dialog'
import { StockGunnyDeleteDialog } from './stock-gunny-delete-dialog'
import { stockGunnyOther } from './stock-gunny-provider'

export function StockGunnyDialogs() {
    const { open, setOpen, currentRow } = stockGunnyOther()

    return (
        <>
            <StockGunnyActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <StockGunnyDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
