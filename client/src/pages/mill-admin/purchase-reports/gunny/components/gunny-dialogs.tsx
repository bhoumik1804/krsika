import { GunnyActionDialog } from './gunny-action-dialog'
import { GunnyDeleteDialog } from './gunny-delete-dialog'
import { useGunny } from './gunny-provider'

export function GunnyDialogs() {
    const { open, setOpen, setCurrentRow, currentRow } = useGunny()

    const handleActionDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            setCurrentRow(null)
        }
        setOpen(isOpen ? open : null)
    }

    const handleDeleteDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            setCurrentRow(null)
        }
        setOpen(isOpen ? 'delete' : null)
    }

    return (
        <>
            <GunnyActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={handleActionDialogChange}
                currentRow={currentRow}
            />
            <GunnyDeleteDialog
                open={open === 'delete'}
                onOpenChange={handleDeleteDialogChange}
                currentRow={currentRow}
            />
        </>
    )
}
