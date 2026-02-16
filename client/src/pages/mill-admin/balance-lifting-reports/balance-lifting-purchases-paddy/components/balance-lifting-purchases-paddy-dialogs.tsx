import { BalanceLiftingPurchasesPaddyActionDialog } from './balance-lifting-purchases-paddy-action-dialog'
import { BalanceLiftingPurchasesPaddyDeleteDialog } from './balance-lifting-purchases-paddy-delete-dialog'
import { useBalanceLiftingPurchasesPaddy } from './balance-lifting-purchases-paddy-provider'

export function BalanceLiftingPurchasesPaddyDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } =
        useBalanceLiftingPurchasesPaddy()

    return (
        <>
            <BalanceLiftingPurchasesPaddyActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) => {
                    setOpen(isOpen ? open : null)
                    if (!isOpen) setCurrentRow(null)
                }}
            />
            <BalanceLiftingPurchasesPaddyDeleteDialog
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
