import { PrivatePaddyOutwardActionDialog } from './private-paddy-outward-action-dialog'
import { PrivatePaddyOutwardDeleteDialog } from './private-paddy-outward-delete-dialog'
import { usePrivatePaddyOutward } from './private-paddy-outward-provider'

export function PrivatePaddyOutwardDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } =
        usePrivatePaddyOutward()

    const handleActionDialogClose = (isOpen: boolean) => {
        if (!isOpen) {
            setCurrentRow(null)
            setOpen(null)
        }
    }

    return (
        <>
            <PrivatePaddyOutwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={handleActionDialogClose}
                currentRow={currentRow}
            />
            <PrivatePaddyOutwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
