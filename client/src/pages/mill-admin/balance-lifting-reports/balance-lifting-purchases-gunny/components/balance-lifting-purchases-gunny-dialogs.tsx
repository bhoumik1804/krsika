import { BalanceLiftingPurchasesGunnyActionDialog } from './balance-lifting-purchases-gunny-action-dialog'
import { BalanceLiftingPurchasesGunnyDeleteDialog } from './balance-lifting-purchases-gunny-delete-dialog'
import { useBalanceLiftingPurchasesGunny } from './balance-lifting-purchases-gunny-provider'

export function BalanceLiftingPurchasesGunnyDialogs() {
    const { open, setOpen, currentRow, millId } = useBalanceLiftingPurchasesGunny()

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
                millId={millId}
            />
        </>
    )
}
