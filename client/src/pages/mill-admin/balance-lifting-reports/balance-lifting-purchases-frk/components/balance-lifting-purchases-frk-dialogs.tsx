import { BalanceLiftingPurchasesFrkActionDialog } from './balance-lifting-purchases-frk-action-dialog'
import { BalanceLiftingPurchasesFrkDeleteDialog } from './balance-lifting-purchases-frk-delete-dialog'
import { useBalanceLiftingPurchasesFrk } from './balance-lifting-purchases-frk-provider'

export function BalanceLiftingPurchasesFrkDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } =
        useBalanceLiftingPurchasesFrk()

    return (
        <>
            <BalanceLiftingPurchasesFrkActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) => {
                    setOpen(isOpen ? open : null)
                    if (!isOpen) setCurrentRow(null)
                }}
            />
            <BalanceLiftingPurchasesFrkDeleteDialog
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
