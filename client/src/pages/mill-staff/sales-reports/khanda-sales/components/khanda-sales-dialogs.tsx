import { KhandaSalesActionDialog } from './khanda-sales-action-dialog'
import { KhandaSalesDeleteDialog } from './khanda-sales-delete-dialog'
import { useKhandaSales } from './khanda-sales-provider'

export function KhandaSalesDialogs() {
    const { open, setOpen, currentRow } = useKhandaSales()

    return (
        <>
            <KhandaSalesActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <KhandaSalesDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
