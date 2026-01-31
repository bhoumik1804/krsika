import { InwardsActionDialog } from './inwards-action-dialog'
import { InwardsDeleteDialog } from './inwards-delete-dialog'
import { useInwards } from './inwards-provider'

export function InwardsDialogs() {
    const { open, setOpen, currentRow } = useInwards()

    return (
        <>
            <InwardsActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <InwardsDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
