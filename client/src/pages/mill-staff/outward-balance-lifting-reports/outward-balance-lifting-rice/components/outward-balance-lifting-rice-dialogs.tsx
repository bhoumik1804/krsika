import { OutwardBalanceLiftingRiceActionDialog } from './outward-balance-lifting-rice-action-dialog'
import { OutwardBalanceLiftingRiceDeleteDialog } from './outward-balance-lifting-rice-delete-dialog'
import { outwardBalanceLiftingRice } from './outward-balance-lifting-rice-provider'

export function OutwardBalanceLiftingRiceDialogs() {
    const { open, setOpen, currentRow } = outwardBalanceLiftingRice()

    return (
        <>
            <OutwardBalanceLiftingRiceActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <OutwardBalanceLiftingRiceDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
