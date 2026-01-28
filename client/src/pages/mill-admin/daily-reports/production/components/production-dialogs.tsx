import { ProductionActionDialog } from './production-action-dialog'
import { ProductionDeleteDialog } from './production-delete-dialog'
import { useProduction } from './production-provider'

export function ProductionDialogs() {
    const { open, setOpen, currentRow } = useProduction()

    return (
        <>
            <ProductionActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <ProductionDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
