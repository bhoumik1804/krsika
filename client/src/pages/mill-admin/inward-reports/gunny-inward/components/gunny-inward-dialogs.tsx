import { GunnyInwardActionDialog } from './gunny-inward-action-dialog'
import { GunnyInwardDeleteDialog } from './gunny-inward-delete-dialog'
import { gunnyInward } from './gunny-inward-provider'

export function GunnyInwardDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = gunnyInward()

    const handleActionDialogClose = (isOpen: boolean) => {
        if (!isOpen) {
            setCurrentRow(null)
        }
        setOpen(isOpen ? open : null)
    }

    return (
        <>
            <GunnyInwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={handleActionDialogClose}
            />
            <GunnyInwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
            />
        </>
    )
}
