import { BalanceLiftingPurchasesGunnyActionDialog } from './balance-lifting-purchases-gunny-action-dialog'
import { BalanceLiftingPurchasesGunnyDeleteDialog } from './balance-lifting-purchases-gunny-delete-dialog'
import { balanceLiftingPurchasesGunny } from './balance-lifting-purchases-gunny-provider'

export function BalanceLiftingPurchasesGunnyDialogs() {
    const { open, setOpen, currentRow } = balanceLiftingPurchasesGunny()

    return (
        <>
            <BalanceLiftingPurchasesGunnyActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <BalanceLiftingPurchasesGunnyDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
