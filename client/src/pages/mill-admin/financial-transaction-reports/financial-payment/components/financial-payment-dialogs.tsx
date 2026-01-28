import { FinancialPaymentActionDialog } from './financial-payment-action-dialog'
import { FinancialPaymentDeleteDialog } from './financial-payment-delete-dialog'
import { FinancialPayment } from './financial-payment-provider'

export function FinancialPaymentDialogs() {
    const { open, setOpen, currentRow } = FinancialPayment()

    return (
        <>
            <FinancialPaymentActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <FinancialPaymentDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}

