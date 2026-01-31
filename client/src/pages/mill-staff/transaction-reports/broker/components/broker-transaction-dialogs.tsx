import { BrokerTransactionActionDialog } from './broker-transaction-action-dialog'
import { BrokerTransactionDeleteDialog } from './broker-transaction-delete-dialog'
import { useBrokerTransaction } from './broker-transaction-provider'

export function BrokerTransactionDialogs() {
    const { open, setOpen, currentRow } = useBrokerTransaction()

    return (
        <>
            <BrokerTransactionActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <BrokerTransactionDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
