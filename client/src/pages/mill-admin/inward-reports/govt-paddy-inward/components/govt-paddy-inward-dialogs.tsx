import { GovtPaddyInwardActionDialog } from './govt-paddy-inward-action-dialog'
import { GovtPaddyInwardDeleteDialog } from './govt-paddy-inward-delete-dialog'
import { useGovtPaddyInward } from './govt-paddy-inward-provider'

export function GovtPaddyInwardDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useGovtPaddyInward()

    const handleActionDialogClose = (isOpen: boolean) => {
        if (!isOpen) {
            setOpen(null)
            setCurrentRow(null)
        }
    }

    return (
        <>
            <GovtPaddyInwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={handleActionDialogClose}
                currentRow={open === 'add' ? null : currentRow}
            />
            <GovtPaddyInwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
