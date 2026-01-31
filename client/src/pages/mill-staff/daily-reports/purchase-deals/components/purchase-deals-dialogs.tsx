import { PurchaseDealsActionDialog } from './purchase-deals-action-dialog'
import { PurchaseDealsDeleteDialog } from './purchase-deals-delete-dialog'
import { usePurchaseDeals } from './purchase-deals-provider'

export function PurchaseDealsDialogs() {
    const { open, setOpen, currentRow } = usePurchaseDeals()

    return (
        <>
            <PurchaseDealsActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <PurchaseDealsDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
