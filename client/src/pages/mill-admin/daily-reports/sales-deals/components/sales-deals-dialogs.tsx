import { SalesDealsActionDialog } from './sales-deals-action-dialog'
import { SalesDealsDeleteDialog } from './sales-deals-delete-dialog'
import { useSalesDeals } from './sales-deals-provider'

export function SalesDealsDialogs() {
    const { open, setOpen, currentRow } = useSalesDeals()

    return (
        <>
            <SalesDealsActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <SalesDealsDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
