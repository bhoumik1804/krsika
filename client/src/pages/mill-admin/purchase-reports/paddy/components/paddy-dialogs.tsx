import { PaddyActionDialog } from './paddy-action-dialog'
import { PaddyDeleteDialog } from './paddy-delete-dialog'
import { usePaddy } from './paddy-provider'

export function PaddyDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = usePaddy()

    const handleDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            setCurrentRow(null)
            setOpen(null)
        } else {
            setOpen('add')
        }
    }

    return (
        <>
            <PaddyActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={handleDialogChange}
                currentRow={currentRow}
            />
            <PaddyDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
