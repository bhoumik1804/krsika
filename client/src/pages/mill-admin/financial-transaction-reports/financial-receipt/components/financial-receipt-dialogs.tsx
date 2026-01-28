import { FinancialReceiptActionDialog } from './financial-receipt-action-dialog'
import { FinancialReceiptDeleteDialog } from './financial-receipt-delete-dialog'
import { FinancialReceipt } from './financial-receipt-provider'

export function FinancialReceiptDialogs() {
    const { open, setOpen, currentRow } = FinancialReceipt()

    return (
        <>
            <FinancialReceiptActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <FinancialReceiptDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}

