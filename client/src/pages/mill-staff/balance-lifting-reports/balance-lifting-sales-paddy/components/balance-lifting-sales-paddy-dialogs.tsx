import { BalanceLiftingSalesPaddyActionDialog } from './balance-lifting-sales-paddy-action-dialog'
import { BalanceLiftingSalesPaddyDeleteDialog } from './balance-lifting-sales-paddy-delete-dialog'
import { balanceLiftingSalesPaddy } from './balance-lifting-sales-paddy-provider'

export function BalanceLiftingSalesPaddyDialogs() {
    const { open, setOpen, currentRow } = balanceLiftingSalesPaddy()

    return (
        <>
            <BalanceLiftingSalesPaddyActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <BalanceLiftingSalesPaddyDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
