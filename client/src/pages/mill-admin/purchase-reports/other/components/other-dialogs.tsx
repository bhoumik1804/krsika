import { OtherActionDialog } from './other-action-dialog'
import { OtherDeleteDialog } from './other-delete-dialog'
import { useOther } from './other-provider'

export function OtherDialogs() {
    const { open, setOpen, currentRow } = useOther()

    return (
        <>
            <OtherActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
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
