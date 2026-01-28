import { KhandaSalesActionDialog } from './khanda-sales-action-dialog'
import { KhandaSalesDeleteDialog } from './khanda-sales-delete-dialog'
import { khandaSales } from './khanda-sales-provider'

export function KhandaSalesDialogs() {
    const { open, setOpen, currentRow } = khandaSales()

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
