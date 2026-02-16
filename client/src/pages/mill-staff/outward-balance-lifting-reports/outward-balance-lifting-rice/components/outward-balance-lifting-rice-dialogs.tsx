import { OutwardBalanceLiftingRiceActionDialog } from './outward-balance-lifting-rice-action-dialog'
import { OutwardBalanceLiftingRiceDeleteDialog } from './outward-balance-lifting-rice-delete-dialog'
import { useOutwardBalanceLiftingRice } from './outward-balance-lifting-rice-provider'

export function OutwardBalanceLiftingRiceDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } =
        useOutwardBalanceLiftingRice()

    return (
        <>
            <OutwardBalanceLiftingRiceActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) => {
                    setOpen(isOpen ? open : null)
                    if (!isOpen) setCurrentRow(null)
                }}
            />
            <OutwardBalanceLiftingRiceDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) => {
                    setOpen(isOpen ? 'delete' : null)
                    if (!isOpen) setCurrentRow(null)
                }}
                currentRow={currentRow}
            />
        </>
    )
}
