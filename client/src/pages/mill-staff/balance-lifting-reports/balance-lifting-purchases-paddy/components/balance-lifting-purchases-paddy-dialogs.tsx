import { BalanceLiftingPurchasesPaddyActionDialog } from './balance-lifting-purchases-paddy-action-dialog'
import { BalanceLiftingPurchasesPaddyDeleteDialog } from './balance-lifting-purchases-paddy-delete-dialog'
import { useBalanceLiftingPurchasesPaddy } from './balance-lifting-purchases-paddy-provider'
import { BalanceLiftingPurchasesPaddyViewDialog } from './balance-lifting-purchases-paddy-view-dialog'

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
            <BalanceLiftingPurchasesPaddyViewDialog
                open={open === 'view'}
                onOpenChange={(isOpen: boolean) => {
                    setOpen(isOpen ? 'view' : null)
                }}
                currentRow={currentRow}
            />
        </>
    )
}
