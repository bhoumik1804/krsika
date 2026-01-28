import { StockGunnyOtherActionDialog } from './stock-gunny-other-action-dialog'
import { StockGunnyOtherDeleteDialog } from './stock-gunny-other-delete-dialog'
import { stockGunnyOther } from './stock-gunny-other-provider'

export function StockGunnyOtherDialogs() {
    const { open, setOpen, currentRow } = stockGunnyOther()

    return (
        <>
            <StockGunnyOtherActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <StockGunnyOtherDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
