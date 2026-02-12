import { PrivateRiceOutwardActionDialog } from './private-rice-outward-action-dialog'
import { PrivateRiceOutwardDeleteDialog } from './private-rice-outward-delete-dialog'
import { usePrivateRiceOutward } from './private-rice-outward-provider'

export function PrivateRiceOutwardDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } =
        usePrivateRiceOutward()

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
            <PrivateRiceOutwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={handleActionDialogClose}
                currentRow={currentRow}
            />
            <PrivateRiceOutwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={handleDeleteDialogClose}
                currentRow={currentRow}
            />
        </>
    )
}
