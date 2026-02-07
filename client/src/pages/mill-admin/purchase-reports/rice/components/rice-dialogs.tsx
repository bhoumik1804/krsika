import { RiceActionDialog } from './rice-action-dialog'
import { RiceDeleteDialog } from './rice-delete-dialog'
import { useRice } from './rice-provider'

export function RiceDialogs() {
    const { open, setOpen } = useRice()

    return (
        <>
            <RiceActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
            />
            <RiceDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
            />
        </>
    )
}
