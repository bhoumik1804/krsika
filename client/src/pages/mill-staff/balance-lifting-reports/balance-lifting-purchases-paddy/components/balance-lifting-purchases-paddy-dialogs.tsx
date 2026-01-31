import { BalanceLiftingPurchasesPaddyActionDialog } from './balance-lifting-purchases-paddy-action-dialog'
import { BalanceLiftingPurchasesPaddyDeleteDialog } from './balance-lifting-purchases-paddy-delete-dialog'
import { balanceLiftingPurchasesPaddy } from './balance-lifting-purchases-paddy-provider'

export function BalanceLiftingPurchasesPaddyDialogs() {
    const { open, setOpen, currentRow } = balanceLiftingPurchasesPaddy()

    return (
        <>
            <BalanceLiftingPurchasesPaddyActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <BalanceLiftingPurchasesPaddyDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
