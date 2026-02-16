import { BalanceLiftingPurchasesRiceActionDialog } from './balance-lifting-purchases-rice-action-dialog'
import { BalanceLiftingPurchasesRiceDeleteDialog } from './balance-lifting-purchases-rice-delete-dialog'
import { useBalanceLiftingPurchasesRice } from './balance-lifting-purchases-rice-provider'

export function BalanceLiftingPurchasesRiceDialogs() {
    const { open, setOpen, currentRow, millId } = useBalanceLiftingPurchasesRice()

    return (
        <>
            <BalanceLiftingPurchasesRiceActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <BalanceLiftingPurchasesRiceDeleteDialog
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
