import { BalanceLiftingSalesPaddyActionDialog } from './balance-lifting-sales-paddy-action-dialog'
import { BalanceLiftingSalesPaddyDeleteDialog } from './balance-lifting-sales-paddy-delete-dialog'
import { useBalanceLiftingSalesPaddy } from './balance-lifting-sales-paddy-provider'

export function BalanceLiftingSalesPaddyDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } =
        useBalanceLiftingSalesPaddy()

    return (
        <>
            <BalanceLiftingSalesPaddyActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) => {
                    setOpen(isOpen ? open : null)
                    if (!isOpen) setCurrentRow(null)
                }}
            />
            <BalanceLiftingSalesPaddyDeleteDialog
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
