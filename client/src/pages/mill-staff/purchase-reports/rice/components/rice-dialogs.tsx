import { RiceActionDialog } from './rice-action-dialog'
import { RiceDeleteDialog } from './rice-delete-dialog'
import { useRice } from './rice-provider'

export function RiceDialogs() {
    const { open, setOpen, currentRow } = useRice()

    return (
        <>
            <RiceActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <RiceDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
