import { RiceActionDialog } from './rice-action-dialog'
import { RiceDeleteDialog } from './rice-delete-dialog'
import { useRice } from './rice-provider'

export function RiceDialogs() {
    const { open, setOpen, setCurrentRow, currentRow } = useRice()

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
            <RiceActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={handleActionDialogChange}
                currentRow={currentRow}
            />
            <RiceDeleteDialog
                open={open === 'delete'}
                onOpenChange={handleDeleteDialogChange}
            />
        </>
    )
}
