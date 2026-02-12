import { GovtGunnyOutwardActionDialog } from './govt-gunny-outward-action-dialog'
import { GovtGunnyOutwardDeleteDialog } from './govt-gunny-outward-delete-dialog'
import { useGovtGunnyOutward } from './govt-gunny-outward-provider'

export function GovtGunnyOutwardDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useGovtGunnyOutward()

    const handleActionDialogClose = (isOpen: boolean) => {
        if (!isOpen) {
            setCurrentRow(null)
            setOpen(null)
        }
    }

    const handleDeleteDialogClose = (isOpen: boolean) => {
        if (!isOpen) {
            setCurrentRow(null)
            setOpen(null)
        }
    }

    return (
        <>
            <GovtGunnyOutwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={handleActionDialogClose}
                currentRow={currentRow}
            />
            <GovtGunnyOutwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={handleDeleteDialogClose}
                currentRow={currentRow}
            />
        </>
    )
}
