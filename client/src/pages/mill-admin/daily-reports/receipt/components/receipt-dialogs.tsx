import { ReceiptActionDialog } from './receipt-action-dialog'
import { useReceipt } from './receipt-provider'

export function ReceiptDialogs() {
    const { open, setOpen, currentRow } = useReceipt()

    return (
        <>
            <ReceiptActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
