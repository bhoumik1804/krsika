import { OutwardsActionDialog } from './outwards-action-dialog'
import { OutwardsDeleteDialog } from './outwards-delete-dialog'
import { useOutwards } from './outwards-provider'

export function OutwardsDialogs() {
    const { open, setOpen, currentRow } = useOutwards()

    return (
        <>
            <OutwardsActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <OutwardsDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
