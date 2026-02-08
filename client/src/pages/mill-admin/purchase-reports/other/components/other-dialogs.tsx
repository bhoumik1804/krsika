import { OtherActionDialog } from './other-action-dialog'
import { OtherDeleteDialog } from './other-delete-dialog'
import { useOther } from './other-provider'

export function OtherDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useOther()

    const handleActionDialogClose = (isOpen: boolean) => {
        if (!isOpen) {
            setOpen(null)
            setCurrentRow(null)
        }
    }

    return (
        <>
            <OtherActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={handleActionDialogClose}
                currentRow={open === 'add' ? null : currentRow}
            />
            <OtherDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
