import { PaymentActionDialog } from './payment-action-dialog'
import { PaymentDeleteDialog } from './payment-delete-dialog'
import { usePayment } from './payment-provider'

export function PaymentDialogs() {
    const { open, setOpen, currentRow } = usePayment()

    return (
        <>
            <PaymentActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <PaymentDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
