import { BalanceLiftingPurchasesFrkActionDialog } from './balance-lifting-purchases-frk-action-dialog'
import { BalanceLiftingPurchasesFrkDeleteDialog } from './balance-lifting-purchases-frk-delete-dialog'
import { balanceLiftingPurchasesFrk } from './balance-lifting-purchases-frk-provider'

export function BalanceLiftingPurchasesFrkDialogs() {
    const { open, setOpen, currentRow } = balanceLiftingPurchasesFrk()

    return (
        <>
            <BalanceLiftingPurchasesFrkActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <BalanceLiftingPurchasesFrkDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
