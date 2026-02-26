import { RiceSalesActionDialog } from './rice-sales-action-dialog'
import { RiceSalesDeleteDialog } from './rice-sales-delete-dialog'
import { useRiceSales } from './rice-sales-provider'

export function RiceSalesDialogs() {
    const { open, setOpen, currentRow } = useRiceSales()

    return (
        <>
            <RiceSalesActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <RiceSalesDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
