import { GunnyInwardActionDialog } from './gunny-inward-action-dialog'
import { GunnyInwardDeleteDialog } from './gunny-inward-delete-dialog'
import { gunnyInward } from './gunny-inward-provider'

export function GunnyInwardDialogs() {
    const { open, setOpen, currentRow } = gunnyInward()

    return (
        <>
            <GunnyInwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <GunnyInwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
