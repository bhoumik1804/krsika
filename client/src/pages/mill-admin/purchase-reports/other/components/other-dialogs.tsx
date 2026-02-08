import { OtherActionDialog } from './other-action-dialog'
import { OtherDeleteDialog } from './other-delete-dialog'
import { useOther } from './other-provider'

export function OtherDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useOther()

    return (
        <>
            <OtherActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) => {
                    if (!isOpen) setCurrentRow(null)
                    setOpen(isOpen ? open : null)
                }}
                currentRow={open === 'edit' ? currentRow : null}
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
