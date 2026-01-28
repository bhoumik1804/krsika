import { PartyTransactionActionDialog } from './party-transaction-action-dialog'
import { PaddyDeleteDialog } from './party-transaction-delete-dialog'
import { usePartyTransaction } from './party-transaction-provider'

export function PartyTransactionDialogs() {
    const { open, setOpen, currentRow } = usePartyTransaction()

    return (
        <>
            <PartyTransactionActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <PaddyDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
