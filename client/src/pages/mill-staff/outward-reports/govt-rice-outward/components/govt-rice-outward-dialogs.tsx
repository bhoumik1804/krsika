import { GovtRiceOutwardActionDialog } from './govt-rice-outward-action-dialog'
import { GovtRiceOutwardDeleteDialog } from './govt-rice-outward-delete-dialog'
import { useGovtRiceOutward } from './govt-rice-outward-provider'

export function GovtRiceOutwardDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useGovtRiceOutward()

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
            <GovtRiceOutwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={handleActionDialogClose}
                currentRow={currentRow}
            />
            <GovtRiceOutwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={handleDeleteDialogClose}
                currentRow={currentRow}
            />
        </>
    )
}
