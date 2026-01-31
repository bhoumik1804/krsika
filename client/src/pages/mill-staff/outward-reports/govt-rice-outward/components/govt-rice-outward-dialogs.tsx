import { GovtRiceOutwardActionDialog } from './govt-rice-outward-action-dialog'
import { GovtRiceOutwardDeleteDialog } from './govt-rice-outward-delete-dialog'
import { useGovtRiceOutward } from './govt-rice-outward-provider'

export function GovtRiceOutwardDialogs() {
    const { open, setOpen, currentRow } = useGovtRiceOutward()

    return (
        <>
            <GovtRiceOutwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <GovtRiceOutwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
